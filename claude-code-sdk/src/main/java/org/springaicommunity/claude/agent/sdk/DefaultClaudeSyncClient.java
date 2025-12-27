/*
 * Copyright 2025 Spring AI Community
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springaicommunity.claude.agent.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.claude.agent.sdk.exceptions.TransportException;
import org.springaicommunity.claude.agent.sdk.exceptions.ClaudeSDKException;
import org.springaicommunity.claude.agent.sdk.hooks.HookCallback;
import org.springaicommunity.claude.agent.sdk.hooks.HookRegistry;
import org.springaicommunity.claude.agent.sdk.mcp.McpMessageHandler;
import org.springaicommunity.claude.agent.sdk.mcp.McpServerConfig;
import org.springaicommunity.claude.agent.sdk.parsing.ParsedMessage;
import org.springaicommunity.claude.agent.sdk.streaming.BlockingMessageReceiver;
import org.springaicommunity.claude.agent.sdk.streaming.MessageReceiver;
import org.springaicommunity.claude.agent.sdk.streaming.MessageStreamIterator;
import org.springaicommunity.claude.agent.sdk.streaming.ResponseBoundedReceiver;
import org.springaicommunity.claude.agent.sdk.transport.StreamingTransport;
import org.springaicommunity.claude.agent.sdk.transport.CLIOptions;
import org.springaicommunity.claude.agent.sdk.types.Message;
import org.springaicommunity.claude.agent.sdk.types.ResultMessage;
import org.springaicommunity.claude.agent.sdk.types.control.ControlRequest;
import org.springaicommunity.claude.agent.sdk.types.control.ControlResponse;
import org.springaicommunity.claude.agent.sdk.types.control.HookEvent;
import org.springaicommunity.claude.agent.sdk.types.control.HookInput;
import org.springaicommunity.claude.agent.sdk.types.control.HookOutput;
import org.springaicommunity.claude.agent.sdk.permission.PermissionResult;
import org.springaicommunity.claude.agent.sdk.permission.ToolPermissionCallback;
import org.springaicommunity.claude.agent.sdk.permission.ToolPermissionContext;

import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;

import java.nio.file.Path;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Default implementation of {@link ClaudeSyncClient} providing blocking multi-turn
 * conversation support.
 *
 * <p>
 * This implementation maintains a persistent connection to the Claude CLI, allowing
 * multi-turn conversations where context is preserved across queries.
 * </p>
 *
 * <p>
 * Thread-safety: This class is thread-safe. Multiple threads can call query() and consume
 * messages concurrently, though typically one thread sends queries and another consumes
 * responses.
 * </p>
 *
 * @see ClaudeSyncClient
 * @see ClaudeClient
 * @see StreamingTransport
 */
public class DefaultClaudeSyncClient implements ClaudeSyncClient {

	private static final Logger logger = LoggerFactory.getLogger(DefaultClaudeSyncClient.class);

	private static final String DEFAULT_SESSION_ID = "default";

	private final Path workingDirectory;

	private final CLIOptions options;

	private final Duration timeout;

	private final String claudePath;

	private final HookRegistry hookRegistry;

	private final ObjectMapper objectMapper;

	// MCP message handler for in-process SDK servers
	private final McpMessageHandler mcpMessageHandler;

	// Session state
	private final AtomicBoolean connected = new AtomicBoolean(false);

	private final AtomicBoolean closed = new AtomicBoolean(false);

	private final AtomicReference<Map<String, Object>> serverInfo = new AtomicReference<>(Collections.emptyMap());

	private final AtomicReference<String> currentSessionId = new AtomicReference<>(DEFAULT_SESSION_ID);

	// Runtime state tracking
	private final AtomicReference<String> currentModel = new AtomicReference<>();

	private final AtomicReference<String> currentPermissionMode = new AtomicReference<>();

	// Tool permission callback
	private volatile ToolPermissionCallback toolPermissionCallback;

	// Transport and streaming
	private volatile StreamingTransport transport;

	private volatile MessageStreamIterator messageIterator;

	private volatile BlockingMessageReceiver blockingReceiver;

	// Control request handling (MCP SDK pattern using MonoSink for correlation)
	private final AtomicInteger requestCounter = new AtomicInteger(0);

	private final String sessionPrefix = UUID.randomUUID().toString().substring(0, 8);

	private final ConcurrentHashMap<String, MonoSink<Map<String, Object>>> pendingResponses = new ConcurrentHashMap<>();

	/**
	 * Creates a new DefaultClaudeSyncClient with the specified configuration.
	 * @param workingDirectory the working directory for Claude CLI
	 * @param options CLI options
	 * @param timeout default operation timeout
	 * @param claudePath optional path to Claude CLI
	 * @param hookRegistry optional hook registry
	 */
	public DefaultClaudeSyncClient(Path workingDirectory, CLIOptions options, Duration timeout, String claudePath,
			HookRegistry hookRegistry) {
		this.workingDirectory = workingDirectory;
		this.options = options != null ? options : CLIOptions.builder().build();
		this.timeout = timeout != null ? timeout : Duration.ofMinutes(10);
		this.claudePath = claudePath;
		this.hookRegistry = hookRegistry != null ? hookRegistry : new HookRegistry();
		this.objectMapper = new ObjectMapper();
		this.mcpMessageHandler = new McpMessageHandler(this.objectMapper);

		// Initialize runtime state from options
		if (this.options.model() != null) {
			this.currentModel.set(this.options.model());
		}
		if (this.options.permissionMode() != null) {
			this.currentPermissionMode.set(this.options.permissionMode().getValue());
		}

		// Register SDK MCP servers for mcp_message handling
		registerMcpServers();
	}

	private void registerMcpServers() {
		Map<String, McpServerConfig> servers = this.options.mcpServers();
		if (servers == null || servers.isEmpty()) {
			return;
		}

		for (Map.Entry<String, McpServerConfig> entry : servers.entrySet()) {
			if (entry.getValue() instanceof McpServerConfig.McpSdkServerConfig sdkConfig) {
				if (sdkConfig.instance() != null) {
					mcpMessageHandler.registerServer(entry.getKey(), sdkConfig.instance());
					logger.info("Registered SDK MCP server: {}", entry.getKey());
				}
				else {
					logger.warn("SDK MCP server {} has null instance", entry.getKey());
				}
			}
		}
	}

	@Override
	public void connect() throws ClaudeSDKException {
		connect(null);
	}

	@Override
	public void connect(String initialPrompt) throws ClaudeSDKException {
		if (closed.get()) {
			throw new TransportException("Client has been closed");
		}
		if (connected.get()) {
			throw new TransportException("Client is already connected");
		}

		try {
			// Create transport
			transport = new StreamingTransport(workingDirectory, timeout, claudePath);

			// Create message receivers
			messageIterator = new MessageStreamIterator();
			blockingReceiver = new BlockingMessageReceiver();

			// Build effective prompt
			String effectivePrompt = initialPrompt != null ? initialPrompt : "Hello";

			// Start session with control request and response handling
			transport.startSession(null, options, this::handleMessage, this::handleControlRequest,
					this::handleControlResponse);

			connected.set(true);

			// Send initialize request with hook configuration if hooks are registered
			if (hookRegistry.hasHooks()) {
				sendInitialize();
			}

			// Now send the initial prompt
			if (effectivePrompt != null) {
				transport.sendUserMessage(effectivePrompt, "default");
			}

			logger.info("Client connected with prompt: {}",
					effectivePrompt.substring(0, Math.min(50, effectivePrompt.length())));
		}
		catch (Exception e) {
			cleanup();
			throw new TransportException("Failed to connect client", e);
		}
	}

	private void sendInitialize() throws ClaudeSDKException {
		Map<String, List<ControlRequest.HookMatcherConfig>> hookConfig = hookRegistry.buildHookConfig();

		if (hookConfig.isEmpty()) {
			logger.debug("No hooks to initialize");
			return;
		}

		Map<String, Object> request = new LinkedHashMap<>();
		request.put("subtype", "initialize");
		request.put("hooks", hookConfig);

		logger.debug("Sending initialize with {} hook event types", hookConfig.size());
		sendControlRequest(request);
		logger.info("Hook configuration sent to CLI: {} event types", hookConfig.size());
	}

	@Override
	public void query(String prompt) throws ClaudeSDKException {
		query(prompt, currentSessionId.get());
	}

	@Override
	public void query(String prompt, String sessionId) throws ClaudeSDKException {
		ensureConnected();

		try {
			// Format user message per Python SDK protocol
			Map<String, Object> message = new LinkedHashMap<>();
			message.put("type", "user");

			Map<String, String> innerMessage = new LinkedHashMap<>();
			innerMessage.put("role", "user");
			innerMessage.put("content", prompt);
			message.put("message", innerMessage);

			message.put("parent_tool_use_id", null);
			message.put("session_id", sessionId);

			String json = objectMapper.writeValueAsString(message);
			transport.sendMessage(json);

			currentSessionId.set(sessionId);
			logger.debug("Sent query in session {}: {}", sessionId, prompt.substring(0, Math.min(50, prompt.length())));
		}
		catch (Exception e) {
			throw new TransportException("Failed to send query", e);
		}
	}

	@Override
	public Iterator<ParsedMessage> receiveMessages() {
		ensureConnected();
		return messageIterator;
	}

	@Override
	public Iterator<ParsedMessage> receiveResponse() {
		ensureConnected();
		return new ResponseBoundedIterator(messageIterator);
	}

	@Override
	public MessageReceiver messageReceiver() {
		ensureConnected();
		return blockingReceiver;
	}

	@Override
	public MessageReceiver responseReceiver() {
		ensureConnected();
		return new ResponseBoundedReceiver(blockingReceiver);
	}

	@Override
	public void interrupt() throws ClaudeSDKException {
		ensureConnected();
		sendControlRequest(Map.of("subtype", "interrupt"));
	}

	@Override
	public void setPermissionMode(String mode) throws ClaudeSDKException {
		ensureConnected();
		sendControlRequest(Map.of("subtype", "set_permission_mode", "mode", mode));
		currentPermissionMode.set(mode);
	}

	@Override
	public void setModel(String model) throws ClaudeSDKException {
		ensureConnected();
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("subtype", "set_model");
		request.put("model", model);
		sendControlRequest(request);
		currentModel.set(model);
	}

	@Override
	public String getCurrentModel() {
		return currentModel.get();
	}

	@Override
	public String getCurrentPermissionMode() {
		return currentPermissionMode.get();
	}

	@Override
	public void setToolPermissionCallback(ToolPermissionCallback callback) {
		this.toolPermissionCallback = callback;
	}

	@Override
	public ToolPermissionCallback getToolPermissionCallback() {
		return toolPermissionCallback;
	}

	@Override
	public Map<String, Object> getServerInfo() {
		return serverInfo.get();
	}

	@Override
	public boolean isConnected() {
		return connected.get() && !closed.get() && transport != null && transport.isRunning();
	}

	@Override
	public void disconnect() {
		close();
	}

	@Override
	public void close() {
		if (closed.compareAndSet(false, true)) {
			connected.set(false);
			cleanup();
			logger.info("Client closed");
		}
	}

	/**
	 * Registers a hook callback for a specific event and tool pattern.
	 * @param event the hook event type
	 * @param toolPattern regex pattern for tool names, or null for all tools
	 * @param callback the callback to execute
	 * @return this client for chaining
	 */
	public DefaultClaudeSyncClient registerHook(HookEvent event, String toolPattern, HookCallback callback) {
		hookRegistry.register(event, toolPattern, callback);
		return this;
	}

	/**
	 * Gets the current session ID.
	 * @return the current session ID
	 */
	public String getCurrentSessionId() {
		return currentSessionId.get();
	}

	private void handleMessage(ParsedMessage message) {
		// Forward regular messages to both receivers
		if (message.isRegularMessage()) {
			messageIterator.offer(message);
			blockingReceiver.offer(message);
		}
	}

	private ControlResponse handleControlRequest(ControlRequest request) {
		String requestId = request.requestId();
		ControlRequest.ControlRequestPayload payload = request.request();

		logger.debug("Handling control request: type={}, requestId={}", payload != null ? payload.subtype() : "null",
				requestId);

		try {
			if (payload instanceof ControlRequest.HookCallbackRequest hookCallback) {
				return handleHookCallback(requestId, hookCallback);
			}
			else if (payload instanceof ControlRequest.CanUseToolRequest canUseTool) {
				return handleCanUseTool(requestId, canUseTool);
			}
			else if (payload instanceof ControlRequest.InitializeRequest init) {
				serverInfo.set(Map.of("hooks", init.hooks() != null ? init.hooks() : Collections.emptyMap()));
				return ControlResponse.success(requestId, Map.of("status", "ok"));
			}
			else if (payload instanceof ControlRequest.McpMessageRequest mcpMessage) {
				return handleMcpMessage(requestId, mcpMessage);
			}
			else {
				return ControlResponse.success(requestId, Map.of());
			}
		}
		catch (Exception e) {
			logger.error("Error handling control request", e);
			return ControlResponse.error(requestId, e.getMessage());
		}
	}

	private ControlResponse handleHookCallback(String requestId, ControlRequest.HookCallbackRequest hookCallback) {
		try {
			String callbackId = hookCallback.callbackId();
			Map<String, Object> inputMap = hookCallback.input();

			HookInput input = objectMapper.convertValue(inputMap, HookInput.class);
			HookOutput output = hookRegistry.executeHook(callbackId, input);

			Map<String, Object> responsePayload = new LinkedHashMap<>();
			responsePayload.put("continue", output.continueExecution());
			if (output.decision() != null) {
				responsePayload.put("decision", output.decision());
			}
			if (output.reason() != null) {
				responsePayload.put("reason", output.reason());
			}
			if (output.hookSpecificOutput() != null) {
				HookOutput.HookSpecificOutput specific = output.hookSpecificOutput();
				if (specific.permissionDecision() != null) {
					responsePayload.put("permission_decision", specific.permissionDecision());
				}
				if (specific.permissionDecisionReason() != null) {
					responsePayload.put("permission_decision_reason", specific.permissionDecisionReason());
				}
				if (specific.updatedInput() != null) {
					responsePayload.put("updated_input", specific.updatedInput());
				}
			}

			return ControlResponse.success(requestId, responsePayload);
		}
		catch (Exception e) {
			logger.error("Error executing hook callback", e);
			return ControlResponse.error(requestId, e.getMessage());
		}
	}

	private ControlResponse handleMcpMessage(String requestId, ControlRequest.McpMessageRequest mcpMessage) {
		String serverName = mcpMessage.serverName();
		Map<String, Object> message = mcpMessage.message();

		logger.debug("Handling MCP message for server {}: method={}", serverName, mcpMessage.getMethod());

		if (!mcpMessageHandler.hasServer(serverName)) {
			logger.warn("MCP server not registered: {}", serverName);
			return ControlResponse.error(requestId, "Unknown MCP server: " + serverName);
		}

		try {
			Map<String, Object> response = mcpMessageHandler.handleMcpMessage(serverName, message);

			if (response == null) {
				return ControlResponse.success(requestId, Map.of());
			}

			return ControlResponse.success(requestId, Map.of("mcp_response", response));
		}
		catch (Exception e) {
			logger.error("Error handling MCP message for server {}", serverName, e);
			return ControlResponse.error(requestId, "MCP error: " + e.getMessage());
		}
	}

	private ControlResponse handleCanUseTool(String requestId, ControlRequest.CanUseToolRequest canUseTool) {
		ToolPermissionCallback callback = toolPermissionCallback;
		if (callback == null) {
			return ControlResponse.success(requestId, Map.of("behavior", "allow"));
		}

		try {
			ToolPermissionContext context = ToolPermissionContext.of(canUseTool.permissionSuggestions(),
					canUseTool.blockedPath(), requestId);

			PermissionResult result = callback.checkPermission(canUseTool.toolName(), canUseTool.input(), context);

			if (result.isAllowed()) {
				PermissionResult.Allow allow = (PermissionResult.Allow) result;
				Map<String, Object> response = new LinkedHashMap<>();
				response.put("behavior", "allow");

				if (allow.hasUpdatedInput()) {
					response.put("updatedInput", allow.updatedInput());
				}
				return ControlResponse.success(requestId, response);
			}
			else {
				PermissionResult.Deny deny = (PermissionResult.Deny) result;
				Map<String, Object> response = new LinkedHashMap<>();
				response.put("behavior", "deny");

				if (deny.hasMessage()) {
					response.put("message", deny.message());
				}
				return ControlResponse.success(requestId, response);
			}
		}
		catch (Exception e) {
			logger.error("Tool permission callback threw exception for tool {}", canUseTool.toolName(), e);
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("behavior", "deny");
			response.put("message", "Permission callback error: " + e.getMessage());
			return ControlResponse.success(requestId, response);
		}
	}

	private void handleControlResponse(ControlResponse response) {
		if (response.response() == null) {
			logger.warn("Received control response with null payload");
			return;
		}

		String requestId = response.response().requestId();
		if (requestId == null) {
			logger.warn("Received control response without request_id");
			return;
		}

		logger.debug("Handling control response: requestId={}, subtype={}", requestId, response.response().subtype());

		MonoSink<Map<String, Object>> sink = pendingResponses.remove(requestId);
		if (sink == null) {
			logger.warn("Unexpected response for unknown request id {}", requestId);
			return;
		}

		Map<String, Object> payload = new LinkedHashMap<>();
		payload.put("subtype", response.response().subtype());

		if (response.response() instanceof ControlResponse.SuccessPayload success) {
			if (success.response() instanceof Map<?, ?> responseMap) {
				@SuppressWarnings("unchecked")
				Map<String, Object> typedMap = (Map<String, Object>) responseMap;
				payload.putAll(typedMap);
			}
			sink.success(payload);
			logger.debug("Control response delivered for requestId={}", requestId);
		}
		else if (response.response() instanceof ControlResponse.ErrorPayload error) {
			sink.error(new ClaudeSDKException("Control request failed: " + error.error()));
			logger.debug("Control response error delivered for requestId={}", requestId);
		}
		else {
			sink.success(payload);
		}
	}

	private String generateRequestId() {
		return sessionPrefix + "-" + requestCounter.getAndIncrement();
	}

	private void sendControlRequest(Map<String, Object> request) throws ClaudeSDKException {
		ensureConnected();

		String requestId = generateRequestId();

		try {
			Map<String, Object> result = Mono.<Map<String, Object>>create(sink -> {
				logger.debug("Sending control request: subtype={}, requestId={}", request.get("subtype"), requestId);

				pendingResponses.put(requestId, sink);

				try {
					Map<String, Object> controlRequest = new LinkedHashMap<>();
					controlRequest.put("type", "control_request");
					controlRequest.put("request_id", requestId);
					controlRequest.put("request", request);

					String json = objectMapper.writeValueAsString(controlRequest);
					transport.sendMessage(json);
				}
				catch (Exception e) {
					pendingResponses.remove(requestId);
					sink.error(e);
				}
			}).timeout(timeout).doOnError(e -> {
				pendingResponses.remove(requestId);
			}).block();

			if (result != null && result.containsKey("error")) {
				throw new ClaudeSDKException("Control request failed: " + result.get("error"));
			}
		}
		catch (ClaudeSDKException e) {
			throw e;
		}
		catch (Exception e) {
			if (e.getCause() instanceof java.util.concurrent.TimeoutException
					|| e instanceof java.util.concurrent.TimeoutException) {
				throw new ClaudeSDKException("Control request timed out: " + request.get("subtype"), e);
			}
			throw new ClaudeSDKException("Failed to send control request", e);
		}
	}

	private void ensureConnected() {
		if (!connected.get()) {
			throw new IllegalStateException("Client is not connected. Call connect() first.");
		}
		if (closed.get()) {
			throw new IllegalStateException("Client has been closed.");
		}
	}

	private void cleanup() {
		if (messageIterator != null) {
			messageIterator.complete();
			messageIterator.close();
		}
		if (blockingReceiver != null) {
			blockingReceiver.complete();
			blockingReceiver.close();
		}
		if (transport != null) {
			transport.close();
		}
		dismissPendingResponses();
	}

	private void dismissPendingResponses() {
		pendingResponses.forEach((id, sink) -> {
			logger.warn("Abruptly terminating pending request: {}", id);
			sink.error(new ClaudeSDKException("Client closed while request was pending"));
		});
		pendingResponses.clear();
	}

	/**
	 * Iterator that stops after receiving a ResultMessage.
	 */
	private static class ResponseBoundedIterator implements Iterator<ParsedMessage> {

		private final Iterator<ParsedMessage> delegate;

		private ParsedMessage next;

		private boolean resultReceived = false;

		ResponseBoundedIterator(Iterator<ParsedMessage> delegate) {
			this.delegate = delegate;
		}

		@Override
		public boolean hasNext() {
			if (resultReceived) {
				return false;
			}
			if (next != null) {
				return true;
			}
			if (delegate.hasNext()) {
				next = delegate.next();
				if (next.isRegularMessage()) {
					Message msg = next.asMessage();
					if (msg instanceof ResultMessage) {
						resultReceived = true;
					}
				}
				return true;
			}
			return false;
		}

		@Override
		public ParsedMessage next() {
			if (next == null) {
				throw new NoSuchElementException("No element available. Did you call hasNext() first?");
			}
			ParsedMessage result = next;
			next = null;
			return result;
		}

	}

}
