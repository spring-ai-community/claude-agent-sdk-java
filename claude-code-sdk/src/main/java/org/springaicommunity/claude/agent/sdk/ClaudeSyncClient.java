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

import org.springaicommunity.claude.agent.sdk.exceptions.ClaudeSDKException;
import org.springaicommunity.claude.agent.sdk.parsing.ParsedMessage;
import org.springaicommunity.claude.agent.sdk.permission.ToolPermissionCallback;
import org.springaicommunity.claude.agent.sdk.streaming.MessageReceiver;
import org.springaicommunity.claude.agent.sdk.types.Message;

import java.util.Iterator;
import java.util.Map;

/**
 * Synchronous (blocking) client for multi-turn conversations with Claude CLI.
 *
 * <p>
 * This is the blocking counterpart to {@link ClaudeAsyncClient}. It maintains a
 * persistent connection to the Claude CLI process, allowing multiple queries within the
 * same context. Claude remembers previous messages in the session.
 * </p>
 *
 * <p>
 * Create instances using the {@link ClaudeClient} factory:
 * </p>
 * <pre>{@code
 * try (ClaudeSyncClient client = ClaudeClient.sync()
 *         .workingDirectory(Path.of("."))
 *         .build()) {
 *
 *     client.connect("My favorite color is blue. Remember this.");
 *     for (Message msg : client.receiveResponse()) {
 *         // Process first response
 *     }
 *
 *     client.query("What is my favorite color?");
 *     for (Message msg : client.receiveResponse()) {
 *         // Claude remembers: "blue"
 *     }
 * }
 * }</pre>
 *
 * <p>
 * This interface follows the MCP Java SDK naming convention where {@code McpSyncClient}
 * is the blocking counterpart to {@code McpAsyncClient}.
 * </p>
 *
 * @see ClaudeClient
 * @see ClaudeAsyncClient
 */
public interface ClaudeSyncClient extends AutoCloseable {

	/**
	 * Connects to the Claude CLI without an initial prompt. The client is ready for
	 * queries after this call.
	 * @throws ClaudeSDKException if connection fails
	 */
	void connect() throws ClaudeSDKException;

	/**
	 * Connects to the Claude CLI with an initial prompt.
	 * @param initialPrompt the first prompt to send
	 * @throws ClaudeSDKException if connection fails
	 */
	void connect(String initialPrompt) throws ClaudeSDKException;

	/**
	 * Sends a follow-up query in the existing session context. The query will be
	 * processed in the context of previous messages.
	 * @param prompt the prompt to send
	 * @throws ClaudeSDKException if sending fails
	 */
	void query(String prompt) throws ClaudeSDKException;

	/**
	 * Sends a follow-up query with a specific session ID.
	 * @param prompt the prompt to send
	 * @param sessionId the session ID to use
	 * @throws ClaudeSDKException if sending fails
	 */
	void query(String prompt, String sessionId) throws ClaudeSDKException;

	/**
	 * Returns an iterator over all messages from the CLI. This iterator yields messages
	 * indefinitely until the session ends.
	 * @return iterator over parsed messages
	 */
	Iterator<ParsedMessage> receiveMessages();

	/**
	 * Returns an iterator that yields messages until a ResultMessage is received. This is
	 * useful for processing a single response before sending another query.
	 * @return iterator over parsed messages, stops after ResultMessage
	 */
	Iterator<ParsedMessage> receiveResponse();

	// ========== Convenience Methods for Elegant Multi-Turn ==========

	/**
	 * Returns an iterable of messages from the current response. This is a convenience
	 * wrapper around {@link #receiveResponse()} that filters to regular messages and
	 * unwraps them, enabling for-each loop usage.
	 *
	 * <p>
	 * Example:
	 * </p>
	 * <pre>{@code
	 * client.connect("Hello");
	 * for (Message msg : client.messages()) {
	 *     System.out.println(msg);
	 * }
	 * }</pre>
	 * @return iterable of messages, stops after ResultMessage
	 */
	Iterable<Message> messages();

	/**
	 * Connects with initial prompt and returns an iterable of response messages. This
	 * combines {@link #connect(String)} and {@link #messages()} for concise multi-turn
	 * conversations.
	 *
	 * <p>
	 * Example:
	 * </p>
	 * <pre>{@code
	 * for (Message msg : client.connectAndReceive("My name is Alice")) {
	 *     System.out.println(msg);
	 * }
	 * }</pre>
	 * @param prompt the initial prompt to send
	 * @return iterable of response messages
	 */
	Iterable<Message> connectAndReceive(String prompt);

	/**
	 * Sends a query and returns an iterable of response messages. This combines
	 * {@link #query(String)} and {@link #messages()} for concise multi-turn
	 * conversations.
	 *
	 * <p>
	 * Example:
	 * </p>
	 * <pre>{@code
	 * client.connect("My name is Alice");
	 * for (Message msg : client.messages()) { ... }
	 *
	 * for (Message msg : client.queryAndReceive("What's my name?")) {
	 *     System.out.println(msg);  // Claude remembers: "Alice"
	 * }
	 * }</pre>
	 * @param prompt the follow-up prompt
	 * @return iterable of response messages
	 */
	Iterable<Message> queryAndReceive(String prompt);

	// ========== Text-Only Convenience Methods (80% Use Case) ==========

	/**
	 * Connects with initial prompt and returns just the text response. This is the
	 * simplest way to get Claude's answer as a string.
	 *
	 * <p>
	 * Example:
	 * </p>
	 * <pre>{@code
	 * String answer = client.connectText("What is 2+2?");
	 * System.out.println(answer);  // "4"
	 * }</pre>
	 * @param prompt the initial prompt
	 * @return concatenated text from all AssistantMessages
	 */
	String connectText(String prompt);

	/**
	 * Sends a query and returns just the text response. Use this for follow-up
	 * questions when you only need the text content.
	 *
	 * <p>
	 * Example:
	 * </p>
	 * <pre>{@code
	 * client.connectText("My name is Alice");
	 * String answer = client.queryText("What's my name?");
	 * System.out.println(answer);  // "Alice"
	 * }</pre>
	 * @param prompt the follow-up prompt
	 * @return concatenated text from all AssistantMessages
	 */
	String queryText(String prompt);

	/**
	 * Returns a message receiver for all messages from the CLI. The receiver yields
	 * messages indefinitely until the session ends.
	 *
	 * <p>
	 * Usage:
	 * </p>
	 * <pre>{@code
	 * try (MessageReceiver receiver = client.messageReceiver()) {
	 *     ParsedMessage msg;
	 *     while ((msg = receiver.next()) != null) {
	 *         handleMessage(msg);
	 *     }
	 * }
	 * }</pre>
	 * @return message receiver that yields all messages
	 */
	MessageReceiver messageReceiver();

	/**
	 * Returns a message receiver that yields messages until a ResultMessage is received.
	 * This is useful for processing a single response before sending another query.
	 *
	 * <p>
	 * Usage:
	 * </p>
	 * <pre>{@code
	 * client.query("What is 2+2?");
	 * try (MessageReceiver receiver = client.responseReceiver()) {
	 *     ParsedMessage msg;
	 *     while ((msg = receiver.next()) != null) {
	 *         handleMessage(msg);
	 *     }
	 * }
	 * // Can now send another query
	 * }</pre>
	 * @return message receiver that stops after ResultMessage
	 */
	MessageReceiver responseReceiver();

	/**
	 * Interrupts the current operation. Sends an interrupt signal to the CLI to stop the
	 * current processing.
	 * @throws ClaudeSDKException if interrupt fails
	 */
	void interrupt() throws ClaudeSDKException;

	/**
	 * Changes the permission mode mid-session.
	 * @param mode the new permission mode (e.g., "default", "acceptEdits", "plan")
	 * @throws ClaudeSDKException if setting mode fails
	 */
	void setPermissionMode(String mode) throws ClaudeSDKException;

	/**
	 * Changes the model mid-session.
	 * @param model the new model name (e.g., "claude-sonnet-4-20250514")
	 * @throws ClaudeSDKException if setting model fails
	 */
	void setModel(String model) throws ClaudeSDKException;

	/**
	 * Returns information about the server/CLI from initialization.
	 * @return map of server information, or empty map if not available
	 */
	Map<String, Object> getServerInfo();

	/**
	 * Gets the current model being used by this client. This reflects any runtime changes
	 * made via {@link #setModel(String)}.
	 * @return the current model ID, or null if not explicitly set
	 */
	String getCurrentModel();

	/**
	 * Gets the current permission mode for this client. This reflects any runtime changes
	 * made via {@link #setPermissionMode(String)}.
	 * @return the current permission mode, or null if not explicitly set
	 */
	String getCurrentPermissionMode();

	/**
	 * Sets a callback to handle tool permission requests. When Claude attempts to use a
	 * tool, this callback is invoked to determine whether the tool should be allowed and
	 * optionally modify the tool's input.
	 *
	 * <p>
	 * Example:
	 * </p>
	 *
	 * <pre>{@code
	 * client.setToolPermissionCallback((toolName, input, context) -> {
	 *     if (toolName.equals("Bash") && input.get("command").toString().contains("rm")) {
	 *         return PermissionResult.deny("Dangerous command blocked");
	 *     }
	 *     return PermissionResult.allow();
	 * });
	 * }</pre>
	 * @param callback the callback to handle permission requests, or null to use default
	 * (allow all)
	 */
	void setToolPermissionCallback(ToolPermissionCallback callback);

	/**
	 * Gets the current tool permission callback.
	 * @return the current callback, or null if using default behavior
	 */
	ToolPermissionCallback getToolPermissionCallback();

	/**
	 * Checks if the client is currently connected.
	 * @return true if connected and ready for queries
	 */
	boolean isConnected();

	/**
	 * Disconnects the client and releases resources. This is an alias for {@link #close()}
	 * for API clarity.
	 */
	void disconnect();

	/**
	 * Closes the client and releases all resources. After calling this method, the client
	 * cannot be reused.
	 */
	@Override
	void close();

}
