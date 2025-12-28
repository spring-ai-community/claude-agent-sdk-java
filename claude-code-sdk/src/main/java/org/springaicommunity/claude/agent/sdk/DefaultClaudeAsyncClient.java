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

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.nio.file.Path;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Default implementation of {@link ClaudeAsyncClient} providing reactive multi-turn
 * conversation support.
 *
 * <p>
 * This implementation maintains a persistent connection to the Claude CLI, allowing
 * multi-turn conversations where context is preserved across queries. All operations
 * return reactive types ({@link Mono} and {@link Flux}) for non-blocking execution.
 * </p>
 *
 * <p>
 * Thread-safety: This class is thread-safe. The underlying reactive streams handle
 * concurrency automatically with proper backpressure support.
 * </p>
 *
 * @see ClaudeAsyncClient
 * @see ClaudeClient
 * @see StreamingTransport
 */
public class DefaultClaudeAsyncClient implements ClaudeAsyncClient {

	private static final Logger logger = LoggerFactory.getLogger(DefaultClaudeAsyncClient.class);

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

	// Transport (set once during connect, read afterward)
	private final AtomicReference<StreamingTransport> transportRef = new AtomicReference<>();

	/**
	 * Per-turn unicast sink for streaming messages to the current receiveResponse() subscriber.
	 *
	 * <p><b>Design Decision:</b> We use a per-turn unicast sink instead of a shared multicast sink
	 * to solve the multi-turn conversation problem. With a shared multicast sink, when
	 * {@code takeUntil(ResultMessage)} cancels after the first turn, the sink enters a corrupted
	 * state and subsequent subscriptions complete immediately.</p>
	 *
	 * <p><b>Pattern:</b> Each {@link #receiveResponse()} call creates a fresh unicast sink via
	 * {@link Sinks.Many#unicast()}. The {@link #handleMessage} callback routes messages to
	 * whatever sink is currently active, and naturally completes the sink when a
	 * {@link ResultMessage} arrives (no {@code takeUntil} operator needed).</p>
	 *
	 * <p>AtomicReference enables thread-safe sink swapping between turns while ensuring
	 * only one turn is active at a time.</p>
	 *
	 * @see #receiveResponse()
	 * @see #handleMessage(ParsedMessage)
	 */
	private final AtomicReference<Sinks.Many<Message>> currentTurnSink = new AtomicReference<>();

	/**
	 * Sink for raw parsed messages (including control messages).
	 * Used by {@link #receiveMessages()} for low-level access.
	 */
	private volatile Sinks.Many<ParsedMessage> rawMessageSink;

	// Control request handling (MCP SDK pattern using MonoSink for correlation)
	private final AtomicInteger requestCounter = new AtomicInteger(0);

	private final String sessionPrefix = UUID.randomUUID().toString().substring(0, 8);

	private final ConcurrentHashMap<String, MonoSink<Map<String, Object>>> pendingResponses = new ConcurrentHashMap<>();

	/**
	 * Creates a new DefaultClaudeAsyncClient with the specified configuration.
	 * @param workingDirectory the working directory for Claude CLI
	 * @param options CLI options
	 * @param timeout default operation timeout
	 * @param claudePath optional path to Claude CLI
	 * @param hookRegistry optional hook registry
	 */
	public DefaultClaudeAsyncClient(Path workingDirectory, CLIOptions options, Duration timeout, String claudePath,
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
	public Mono<Void> connect() {
		return connect(null);
	}

	@Override
	public Mono<Void> connect(String initialPrompt) {
		return Mono.<Void>create(sink -> {
			if (closed.get()) {
				sink.error(new TransportException("Client has been closed"));
				return;
			}
			if (connected.get()) {
				sink.error(new TransportException("Client is already connected"));
				return;
			}

			try {
				// Create transport
				StreamingTransport transport = new StreamingTransport(workingDirectory, timeout, claudePath);
				transportRef.set(transport);

				// Create raw message sink for receiveMessages() (low-level access)
				rawMessageSink = Sinks.many().multicast().onBackpressureBuffer();

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
					transport.sendUserMessage(effectivePrompt, DEFAULT_SESSION_ID);
				}

				logger.info("Client connected with prompt: {}",
						effectivePrompt.substring(0, Math.min(50, effectivePrompt.length())));

				sink.success();
			}
			catch (Exception e) {
				cleanup();
				sink.error(new TransportException("Failed to connect client", e));
			}
		}).subscribeOn(Schedulers.boundedElastic());
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
	public Mono<Void> query(String prompt) {
		return Mono.<Void>create(sink -> {
			if (!connected.get() || closed.get()) {
				sink.error(new IllegalStateException("Client is not connected"));
				return;
			}

			try {
				// Format user message per Python SDK protocol
				Map<String, Object> message = new LinkedHashMap<>();
				message.put("type", "user");

				Map<String, String> innerMessage = new LinkedHashMap<>();
				innerMessage.put("role", "user");
				innerMessage.put("content", prompt);
				message.put("message", innerMessage);

				message.put("parent_tool_use_id", null);
				message.put("session_id", currentSessionId.get());

				String json = objectMapper.writeValueAsString(message);
				transportRef.get().sendMessage(json);

				logger.debug("Sent query in session {}: {}", currentSessionId.get(),
						prompt.substring(0, Math.min(50, prompt.length())));

				sink.success();
			}
			catch (Exception e) {
				sink.error(new TransportException("Failed to send query", e));
			}
		}).subscribeOn(Schedulers.boundedElastic());
	}

	@Override
	public Flux<ParsedMessage> receiveMessages() {
		// Use defer to delay the connected check until subscription time
		return Flux.defer(() -> {
			if (!connected.get() || closed.get()) {
				return Flux.error(new IllegalStateException("Client is not connected"));
			}
			// Subscribe to raw message sink for low-level access
			return rawMessageSink.asFlux();
		});
	}

	/**
	 * Receives response messages for the current turn as a reactive stream.
	 *
	 * <p><b>Per-Turn Unicast Sink Pattern:</b> Each call creates a fresh unicast sink that
	 * receives messages until a {@link ResultMessage} arrives. This design solves the
	 * multi-turn problem where shared multicast sinks become corrupted after
	 * {@code takeUntil} cancellation.</p>
	 *
	 * <p><b>How it works:</b></p>
	 * <ol>
	 *   <li>{@code Flux.defer()} delays sink creation until subscription</li>
	 *   <li>A fresh {@link Sinks.Many#unicast()} sink is created for this turn</li>
	 *   <li>The sink is atomically swapped into {@link #currentTurnSink}</li>
	 *   <li>{@link #handleMessage} routes messages to the active sink</li>
	 *   <li>When {@link ResultMessage} arrives, {@code handleMessage} completes the sink</li>
	 *   <li>{@code doFinally} clears the reference to allow the next turn</li>
	 * </ol>
	 *
	 * <p><b>Why no takeUntil:</b> The {@code takeUntil} operator cancels upstream on predicate
	 * match, which corrupts shared sinks. Instead, we complete the sink directly in
	 * {@code handleMessage} when we see {@code ResultMessage}.</p>
	 *
	 * @return Flux of messages that completes after ResultMessage
	 */
	@Override
	public Flux<Message> receiveResponse() {
		return Flux.defer(() -> {
			logger.debug("receiveResponse() subscribed: connected={}, closed={}",
					connected.get(), closed.get());
			if (!connected.get() || closed.get()) {
				return Flux.error(new IllegalStateException("Client is not connected"));
			}

			// Create fresh unicast sink for this turn
			Sinks.Many<Message> turnSink = Sinks.many().unicast().onBackpressureBuffer();
			logger.debug("Created new turn sink");

			// Atomically swap in the new sink, completing any previous one
			Sinks.Many<Message> previous = currentTurnSink.getAndSet(turnSink);
			if (previous != null) {
				logger.debug("Completing previous turn sink");
				previous.tryEmitComplete();
			}

			return turnSink.asFlux()
				.doOnNext(msg -> logger.debug("receiveResponse emitting: {}",
						msg.getClass().getSimpleName()))
				.doOnComplete(() -> logger.debug("receiveResponse completed"))
				.doOnCancel(() -> logger.debug("receiveResponse cancelled"))
				.doFinally(signal -> {
					// Clear the sink reference when done (success, error, or cancel)
					currentTurnSink.compareAndSet(turnSink, null);
					logger.debug("Turn sink cleared (signal={})", signal);
				});
		});
	}

	@Override
	public Mono<Void> interrupt() {
		return Mono.<Void>create(sink -> {
			if (!connected.get() || closed.get()) {
				sink.error(new IllegalStateException("Client is not connected"));
				return;
			}
			try {
				sendControlRequest(Map.of("subtype", "interrupt"));
				sink.success();
			}
			catch (Exception e) {
				sink.error(new TransportException("Failed to send interrupt", e));
			}
		}).subscribeOn(Schedulers.boundedElastic());
	}

	@Override
	public Mono<Void> setPermissionMode(String mode) {
		return Mono.<Void>create(sink -> {
			if (!connected.get() || closed.get()) {
				sink.error(new IllegalStateException("Client is not connected"));
				return;
			}
			try {
				sendControlRequest(Map.of("subtype", "set_permission_mode", "mode", mode));
				currentPermissionMode.set(mode);
				sink.success();
			}
			catch (Exception e) {
				sink.error(new TransportException("Failed to set permission mode", e));
			}
		}).subscribeOn(Schedulers.boundedElastic());
	}

	@Override
	public Mono<Void> setModel(String model) {
		return Mono.<Void>create(sink -> {
			if (!connected.get() || closed.get()) {
				sink.error(new IllegalStateException("Client is not connected"));
				return;
			}
			try {
				Map<String, Object> request = new LinkedHashMap<>();
				request.put("subtype", "set_model");
				request.put("model", model);
				sendControlRequest(request);
				currentModel.set(model);
				sink.success();
			}
			catch (Exception e) {
				sink.error(new TransportException("Failed to set model", e));
			}
		}).subscribeOn(Schedulers.boundedElastic());
	}

	@Override
	public Optional<Map<String, Object>> getServerInfo() {
		Map<String, Object> info = serverInfo.get();
		return info.isEmpty() ? Optional.empty() : Optional.of(info);
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
	public boolean isConnected() {
		StreamingTransport transport = transportRef.get();
		return connected.get() && !closed.get() && transport != null && transport.isRunning();
	}

	@Override
	public Mono<Void> close() {
		return Mono.<Void>fromRunnable(() -> {
			if (closed.compareAndSet(false, true)) {
				connected.set(false);
				cleanup();
				logger.info("Client closed");
			}
		}).subscribeOn(Schedulers.boundedElastic());
	}

	/**
	 * Registers a hook callback for a specific event and tool pattern.
	 * @param event the hook event type
	 * @param toolPattern regex pattern for tool names, or null for all tools
	 * @param callback the callback to execute
	 * @return this client for chaining
	 */
	public DefaultClaudeAsyncClient registerHook(HookEvent event, String toolPattern, HookCallback callback) {
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

	/**
	 * Gets the current model.
	 * @return the current model
	 */
	public String getCurrentModel() {
		return currentModel.get();
	}

	/**
	 * Gets the current permission mode.
	 * @return the current permission mode
	 */
	public String getCurrentPermissionMode() {
		return currentPermissionMode.get();
	}

	// ========================================================================
	// Internal Methods
	// ========================================================================

	/**
	 * Routes incoming messages to the appropriate sinks.
	 *
	 * <p><b>Message Routing:</b></p>
	 * <ul>
	 *   <li>All messages go to {@link #rawMessageSink} for low-level subscribers</li>
	 *   <li>Regular messages go to {@link #currentTurnSink} for turn-scoped subscribers</li>
	 *   <li>{@link ResultMessage} triggers natural sink completion (no takeUntil needed)</li>
	 * </ul>
	 *
	 * <p><b>Why ResultMessage completes the sink:</b> In the per-turn unicast pattern,
	 * we complete the sink directly when ResultMessage arrives rather than using
	 * {@code takeUntil}. This avoids the upstream cancellation that corrupts shared sinks.</p>
	 *
	 * @param message the parsed message from the CLI
	 */
	private void handleMessage(ParsedMessage message) {
		// Route to raw sink for low-level access
		if (rawMessageSink != null) {
			rawMessageSink.tryEmitNext(message);
		}

		// Route regular messages to current turn sink
		if (message.isRegularMessage()) {
			Message msg = message.asMessage();
			Sinks.Many<Message> sink = currentTurnSink.get();

			if (sink != null) {
				Sinks.EmitResult result = sink.tryEmitNext(msg);
				if (result.isSuccess()) {
					logger.debug("handleMessage: emitted {} to turn sink",
							msg.getClass().getSimpleName());
				} else {
					logger.warn("handleMessage: failed to emit {} - result={}",
							msg.getClass().getSimpleName(), result);
				}

				// Complete the sink when ResultMessage arrives (natural completion)
				if (msg instanceof ResultMessage) {
					logger.debug("handleMessage: ResultMessage received, completing turn sink");
					sink.tryEmitComplete();
				}
			} else {
				logger.debug("handleMessage: no turn sink active, skipping {}",
						msg.getClass().getSimpleName());
			}
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
			}

			return ControlResponse.success(requestId, responsePayload);
		}
		catch (Exception e) {
			logger.error("Hook callback failed", e);
			return ControlResponse.error(requestId, "Hook execution failed: " + e.getMessage());
		}
	}

	private ControlResponse handleCanUseTool(String requestId, ControlRequest.CanUseToolRequest canUseTool) {
		if (toolPermissionCallback == null) {
			// No callback registered, allow by default
			return ControlResponse.success(requestId, Map.of("behavior", "allow"));
		}

		try {
			String toolName = canUseTool.toolName();
			Map<String, Object> input = canUseTool.input();
			ToolPermissionContext context = new ToolPermissionContext(
					canUseTool.permissionSuggestions(),
					canUseTool.blockedPath(),
					requestId);

			PermissionResult result = toolPermissionCallback.checkPermission(toolName, input, context);

			Map<String, Object> response = new LinkedHashMap<>();
			if (result.isAllowed()) {
				response.put("behavior", "allow");
				if (result instanceof PermissionResult.Allow allow && allow.hasUpdatedInput()) {
					response.put("updatedInput", allow.updatedInput());
				}
			}
			else {
				response.put("behavior", "deny");
				if (result instanceof PermissionResult.Deny deny && deny.hasMessage()) {
					response.put("message", deny.message());
				}
			}

			return ControlResponse.success(requestId, response);
		}
		catch (Exception e) {
			logger.error("Permission callback failed", e);
			return ControlResponse.error(requestId, "Permission check failed: " + e.getMessage());
		}
	}

	private ControlResponse handleMcpMessage(String requestId, ControlRequest.McpMessageRequest mcpMessage) {
		try {
			String serverName = mcpMessage.serverName();
			Map<String, Object> message = mcpMessage.message();

			Map<String, Object> response = mcpMessageHandler.handleMcpMessage(serverName, message);
			return ControlResponse.success(requestId, response);
		}
		catch (Exception e) {
			logger.error("MCP message handling failed", e);
			return ControlResponse.error(requestId, "MCP message handling failed: " + e.getMessage());
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

	private void sendControlRequest(Map<String, Object> request) throws ClaudeSDKException {
		try {
			String requestId = sessionPrefix + "_" + requestCounter.incrementAndGet();

			Map<String, Object> fullRequest = new LinkedHashMap<>();
			fullRequest.put("type", "control");
			fullRequest.put("request_id", requestId);
			fullRequest.putAll(request);

			String json = objectMapper.writeValueAsString(fullRequest);
			transportRef.get().sendMessage(json);

			logger.debug("Sent control request: id={}, subtype={}", requestId, request.get("subtype"));
		}
		catch (Exception e) {
			throw new TransportException("Failed to send control request", e);
		}
	}

	private void cleanup() {
		StreamingTransport transport = transportRef.getAndSet(null);
		if (transport != null) {
			try {
				transport.close();
			}
			catch (Exception e) {
				logger.warn("Error closing transport", e);
			}
		}

		// Complete and clear the current turn sink
		Sinks.Many<Message> turnSink = currentTurnSink.getAndSet(null);
		if (turnSink != null) {
			turnSink.tryEmitComplete();
		}

		// Complete and clear the raw message sink
		if (rawMessageSink != null) {
			rawMessageSink.tryEmitComplete();
			rawMessageSink = null;
		}

		pendingResponses.clear();
	}

}
