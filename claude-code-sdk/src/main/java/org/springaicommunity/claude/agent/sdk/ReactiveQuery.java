/*
 * Copyright 2024 Spring AI Community
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

import org.springaicommunity.claude.agent.sdk.transport.ReactiveTransport;
import org.springaicommunity.claude.agent.sdk.types.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

/**
 * Reactive entry point for one-shot Claude Code queries using Project Reactor. Provides
 * non-blocking operations with backpressure support.
 *
 * <p>
 * This class corresponds to the async {@code query()} function in Python/TypeScript SDKs.
 * For multi-turn conversations, hooks, or MCP integration, use
 * {@link org.springaicommunity.claude.agent.sdk.session.ClaudeSession} instead.
 *
 * <h2>Quick Start</h2>
 *
 * <pre>{@code
 * // Simplest usage - get text response
 * ReactiveQuery.text("What is 2+2?")
 *     .subscribe(System.out::println);
 *
 * // Stream messages as they arrive
 * ReactiveQuery.query("Explain recursion")
 *     .filter(msg -> msg instanceof AssistantMessage)
 *     .subscribe(msg -> System.out.println(msg));
 *
 * // Full result with metadata
 * ReactiveQuery.execute("Write a haiku")
 *     .subscribe(result -> {
 *         System.out.println(result.text().orElse(""));
 *         System.out.println("Cost: $" + result.metadata().cost().calculateTotal());
 *     });
 * }</pre>
 *
 * <h2>With Options</h2>
 *
 * <pre>{@code
 * ReactiveQuery.text("Explain quantum computing",
 *     QueryOptions.builder()
 *         .model("claude-sonnet-4-5-20250929")
 *         .systemPrompt("Be concise")
 *         .build())
 *     .subscribe(System.out::println);
 * }</pre>
 *
 * <h2>Spring WebFlux Integration</h2>
 *
 * <pre>{@code
 * @GetMapping(value = "/ask", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
 * public Flux<String> ask(@RequestParam String question) {
 *     return ReactiveQuery.query(question)
 *         .filter(msg -> msg instanceof AssistantMessage)
 *         .flatMap(msg -> ((AssistantMessage) msg).getTextContent()
 *             .map(Mono::just).orElse(Mono.empty()));
 * }
 * }</pre>
 *
 * @see Query
 * @see QueryOptions
 * @see org.springaicommunity.claude.agent.sdk.session.ClaudeSession
 */
public final class ReactiveQuery {

	private ReactiveQuery() {
		// Static utility class
	}

	// ========================================================================
	// Simple API - text()
	// ========================================================================

	/**
	 * Executes a query and returns just the text response reactively.
	 *
	 * <pre>{@code
	 * ReactiveQuery.text("What is 2+2?")
	 *     .subscribe(answer -> System.out.println(answer));  // "4"
	 * }</pre>
	 * @param prompt the prompt to send to Claude
	 * @return Mono containing the text response, or empty string if no response
	 */
	public static Mono<String> text(String prompt) {
		return text(prompt, QueryOptions.defaults());
	}

	/**
	 * Executes a query with options and returns just the text response reactively.
	 * @param prompt the prompt to send to Claude
	 * @param options configuration options
	 * @return Mono containing the text response, or empty string if no response
	 */
	public static Mono<String> text(String prompt, QueryOptions options) {
		return execute(prompt, options).map(result -> result.text().orElse(""));
	}

	// ========================================================================
	// Streaming API - query()
	// ========================================================================

	/**
	 * Executes a query and returns a Flux of messages as they arrive. True non-blocking
	 * with backpressure support.
	 *
	 * <pre>{@code
	 * ReactiveQuery.query("Explain recursion")
	 *     .filter(msg -> msg instanceof AssistantMessage)
	 *     .flatMap(msg -> ((AssistantMessage) msg).getTextContent()
	 *         .map(Mono::just).orElse(Mono.empty()))
	 *     .subscribe(System.out::print);
	 * }</pre>
	 * @param prompt the prompt to send to Claude
	 * @return Flux of messages that completes when the query finishes
	 */
	public static Flux<Message> query(String prompt) {
		return query(prompt, QueryOptions.defaults());
	}

	/**
	 * Executes a query with options and returns a Flux of messages.
	 * @param prompt the prompt to send to Claude
	 * @param options configuration options
	 * @return Flux of messages that completes when the query finishes
	 */
	public static Flux<Message> query(String prompt, QueryOptions options) {
		ReactiveTransport transport = new ReactiveTransport(options.workingDirectory(), options.timeout());

		return transport.executeReactiveQuery(prompt, options.toCLIOptions()).doFinally(signal -> transport.close());
	}

	// ========================================================================
	// Full API - execute()
	// ========================================================================

	/**
	 * Executes a query and returns the full result with metadata reactively.
	 * @param prompt the prompt to send to Claude
	 * @return Mono containing the complete query result including messages and metadata
	 */
	public static Mono<QueryResult> execute(String prompt) {
		return execute(prompt, QueryOptions.defaults());
	}

	/**
	 * Executes a query with options and returns the full result reactively.
	 * @param prompt the prompt to send to Claude
	 * @param options configuration options
	 * @return Mono containing the complete query result including messages and metadata
	 */
	public static Mono<QueryResult> execute(String prompt, QueryOptions options) {
		return query(prompt, options).collectList().map(messages -> {
			// Find the result message to extract metadata
			Optional<ResultMessage> resultMessage = messages.stream()
				.filter(m -> m instanceof ResultMessage)
				.map(m -> (ResultMessage) m)
				.findFirst();

			// Build metadata from result message
			String model = options.model() != null ? options.model() : "unknown";
			Metadata metadata = resultMessage.map(rm -> rm.toMetadata(model)).orElse(createDefaultMetadata(model));

			// Determine result status
			ResultStatus status = determineStatus(messages, resultMessage);

			return QueryResult.builder().messages(messages).metadata(metadata).status(status).build();
		});
	}

	/**
	 * Creates default metadata when no result message is available.
	 */
	private static Metadata createDefaultMetadata(String model) {
		return Metadata.builder()
			.model(model)
			.cost(Cost.builder()
				.inputTokenCost(0.0)
				.outputTokenCost(0.0)
				.inputTokens(0)
				.outputTokens(0)
				.model(model)
				.build())
			.usage(Usage.builder().inputTokens(0).outputTokens(0).thinkingTokens(0).build())
			.durationMs(0)
			.apiDurationMs(0)
			.sessionId("unknown")
			.numTurns(1)
			.build();
	}

	/**
	 * Determines the result status based on messages and result data.
	 */
	private static ResultStatus determineStatus(java.util.List<Message> messages,
			Optional<ResultMessage> resultMessage) {
		if (resultMessage.isPresent()) {
			ResultMessage rm = resultMessage.get();
			if (rm.isError()) {
				return ResultStatus.ERROR;
			}
		}

		if (messages.isEmpty()) {
			return ResultStatus.ERROR;
		}

		boolean hasAssistantMessage = messages.stream().anyMatch(m -> m instanceof AssistantMessage);
		return hasAssistantMessage ? ResultStatus.SUCCESS : ResultStatus.PARTIAL;
	}

}
