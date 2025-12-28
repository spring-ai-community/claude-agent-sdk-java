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

import org.springaicommunity.claude.agent.sdk.parsing.ParsedMessage;
import org.springaicommunity.claude.agent.sdk.permission.ToolPermissionCallback;
import org.springaicommunity.claude.agent.sdk.types.Message;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Optional;

/**
 * Reactive client for interacting with Claude CLI using Project Reactor.
 *
 * <p>
 * This interface provides non-blocking, backpressure-aware operations for multi-turn
 * conversations with Claude. It is the reactive equivalent of {@link ClaudeSyncClient}
 * and is designed for Spring WebFlux and other reactive applications.
 * </p>
 *
 * <h2>Key Features</h2>
 * <ul>
 * <li>Non-blocking operations with {@link Mono} and {@link Flux}</li>
 * <li>Backpressure support for message streaming</li>
 * <li>Multi-turn conversation support</li>
 * <li>Hook support for intercepting tool calls</li>
 * <li>MCP server integration</li>
 * <li>Permission callbacks for tool authorization</li>
 * </ul>
 *
 * <h2>Basic Usage</h2>
 * <pre>{@code
 * ClaudeAsyncClient client = ClaudeClient.async()
 *     .workingDirectory(Path.of("."))
 *     .model("claude-sonnet-4-20250514")
 *     .build();
 *
 * client.connect("Hello!")
 *     .thenMany(client.receiveResponse())
 *     .filter(msg -> msg instanceof AssistantMessage)
 *     .subscribe(msg -> System.out.println(msg));
 * }</pre>
 *
 * <h2>Multi-turn Conversation</h2>
 * <pre>{@code
 * client.connect("My favorite color is blue.")
 *     .thenMany(client.receiveResponse())
 *     .then()
 *     .then(client.query("What is my favorite color?"))
 *     .thenMany(client.receiveResponse())
 *     .subscribe(msg -> System.out.println(msg));  // Claude remembers: "blue"
 * }</pre>
 *
 * <h2>Spring WebFlux SSE Endpoint</h2>
 * <pre>{@code
 * @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
 * public Flux<String> chat(@RequestParam String message) {
 *     return client.query(message)
 *         .thenMany(client.receiveResponse())
 *         .filter(msg -> msg instanceof AssistantMessage)
 *         .flatMap(msg -> ((AssistantMessage) msg).getTextContent()
 *             .map(Mono::just).orElse(Mono.empty()));
 * }
 * }</pre>
 *
 * <h2>Lifecycle</h2>
 * <p>
 * The client should be closed when no longer needed to release resources:
 * </p>
 * <pre>{@code
 * client.close()
 *     .subscribe();
 * }</pre>
 *
 * @see ClaudeSyncClient
 * @see ClaudeClient#async()
 */
public interface ClaudeAsyncClient {

	// ========================================================================
	// Connection Management
	// ========================================================================

	/**
	 * Connects to Claude CLI and starts a new session without an initial prompt.
	 * @return Mono that completes when the connection is established
	 */
	Mono<Void> connect();

	/**
	 * Connects to Claude CLI and starts a new session with an initial prompt.
	 *
	 * <p>
	 * This is equivalent to calling {@link #connect()} followed by {@link #query(String)}.
	 * </p>
	 * @param initialPrompt the initial prompt to send
	 * @return Mono that completes when the prompt has been sent
	 */
	Mono<Void> connect(String initialPrompt);

	/**
	 * Returns whether the client is currently connected to Claude CLI.
	 * @return true if connected, false otherwise
	 */
	boolean isConnected();

	// ========================================================================
	// Query Operations
	// ========================================================================

	/**
	 * Sends a query to Claude. Must be connected first.
	 * @param prompt the prompt to send
	 * @return Mono that completes when the prompt has been sent
	 */
	Mono<Void> query(String prompt);

	/**
	 * Receives response messages from Claude as a reactive stream.
	 *
	 * <p>
	 * The returned Flux emits messages as they arrive and completes when a
	 * {@link org.springaicommunity.claude.agent.sdk.types.ResultMessage} is received.
	 * </p>
	 * @return Flux of parsed messages
	 */
	Flux<ParsedMessage> receiveMessages();

	/**
	 * Receives response messages, returning only regular messages (not control messages).
	 *
	 * <p>
	 * This is a convenience method that filters to regular messages and converts them
	 * to the {@link Message} type.
	 * </p>
	 * @return Flux of messages
	 */
	Flux<Message> receiveResponse();

	// ========================================================================
	// Session Control
	// ========================================================================

	/**
	 * Interrupts the current Claude operation.
	 * @return Mono that completes when the interrupt has been sent
	 */
	Mono<Void> interrupt();

	/**
	 * Sets the permission mode for tool execution.
	 * @param mode the permission mode (e.g., "default", "acceptEdits", "bypassPermissions")
	 * @return Mono that completes when the mode has been set
	 */
	Mono<Void> setPermissionMode(String mode);

	/**
	 * Changes the Claude model during the session.
	 * @param model the model ID to switch to
	 * @return Mono that completes when the model has been changed
	 */
	Mono<Void> setModel(String model);

	// ========================================================================
	// Server Info
	// ========================================================================

	/**
	 * Returns server information received during initialization.
	 * @return Optional containing server info map, or empty if not yet received
	 */
	Optional<Map<String, Object>> getServerInfo();

	// ========================================================================
	// Permission Callback
	// ========================================================================

	/**
	 * Sets a callback for tool permission decisions.
	 * @param callback the callback to invoke for permission checks
	 */
	void setToolPermissionCallback(ToolPermissionCallback callback);

	/**
	 * Gets the current tool permission callback.
	 * @return the current callback, or null if none set
	 */
	ToolPermissionCallback getToolPermissionCallback();

	// ========================================================================
	// Lifecycle
	// ========================================================================

	/**
	 * Closes the client and releases all resources.
	 * @return Mono that completes when the client is closed
	 */
	Mono<Void> close();

	/**
	 * Alias for {@link #close()} for semantic clarity.
	 * @return Mono that completes when disconnected
	 */
	default Mono<Void> disconnect() {
		return close();
	}

}
