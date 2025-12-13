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

package org.springaicommunity.claude.agent.examples;

import org.springaicommunity.claude.agent.sdk.Query;
import org.springaicommunity.claude.agent.sdk.QueryOptions;
import org.springaicommunity.claude.agent.sdk.ReactiveQuery;
import org.springaicommunity.claude.agent.sdk.config.PermissionMode;
import org.springaicommunity.claude.agent.sdk.hooks.HookRegistry;
import org.springaicommunity.claude.agent.sdk.parsing.ParsedMessage;
import org.springaicommunity.claude.agent.sdk.session.DefaultClaudeSession;
import org.springaicommunity.claude.agent.sdk.streaming.MessageReceiver;
import org.springaicommunity.claude.agent.sdk.transport.CLIOptions;
import org.springaicommunity.claude.agent.sdk.types.AssistantMessage;
import org.springaicommunity.claude.agent.sdk.types.QueryResult;
import org.springaicommunity.claude.agent.sdk.types.control.HookInput;
import org.springaicommunity.claude.agent.sdk.types.control.HookOutput;

import java.nio.file.Path;
import java.time.Duration;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Comprehensive example demonstrating Claude Agent SDK usage patterns.
 *
 * <p>
 * This example shows multiple SDK APIs from simple to advanced:
 * </p>
 * <ul>
 * <li>Simple Query API - one-liner for quick queries</li>
 * <li>Query with Options - configuring model behavior</li>
 * <li>Full Result with Metadata - accessing cost, tokens, duration</li>
 * <li>Reactive Streaming - real-time response streaming</li>
 * <li>Session with Hooks - intercepting tool calls with PreToolUse hooks</li>
 * </ul>
 */
public class HelloWorld {

	public static void main(String[] args) {
		System.out.println("Claude Agent SDK - Hello World Example");
		System.out.println("=".repeat(50));
		System.out.println();

		try {
			// ============================================================
			// 1. SIMPLE API - One line!
			// ============================================================
			System.out.println("1. Simple Query (one line):");
			System.out.println("-".repeat(50));

			String answer = Query.text("What is 2+2? Reply with just the number.");
			System.out.println("Answer: " + answer);
			System.out.println();

			// ============================================================
			// 2. WITH OPTIONS
			// ============================================================
			System.out.println("2. Query with Options:");
			System.out.println("-".repeat(50));

			String funFact = Query.text("Tell me a fun fact about Java programming.",
					QueryOptions.builder().appendSystemPrompt("Be concise, one sentence max.").build());
			System.out.println("Fun fact: " + funFact);
			System.out.println();

			// ============================================================
			// 3. FULL RESULT WITH METADATA
			// ============================================================
			System.out.println("3. Full Result with Metadata:");
			System.out.println("-".repeat(50));

			QueryResult result = Query.execute("Write a haiku about coding.");
			result.text().ifPresent(text -> System.out.println("Haiku:\n" + text));
			System.out.println();
			System.out.println("Metadata:");
			System.out.println("  - Model: " + result.metadata().model());
			System.out.println("  - Cost: $" + result.metadata().cost().calculateTotal());
			System.out.println("  - Duration: " + result.metadata().getDuration().toMillis() + "ms");
			System.out.println("  - Turns: " + result.metadata().numTurns());
			System.out.println();

			// ============================================================
			// 4. REACTIVE STREAMING
			// ============================================================
			System.out.println("4. Reactive Streaming:");
			System.out.println("-".repeat(50));
			System.out.println("Response (streaming): ");

			CountDownLatch streamLatch = new CountDownLatch(1);
			AtomicInteger charCount = new AtomicInteger(0);

			ReactiveQuery.query("Explain recursion in 2 sentences.")
				.filter(msg -> msg instanceof AssistantMessage)
				.flatMap(msg -> ((AssistantMessage) msg).getTextContent().map(reactor.core.publisher.Mono::just)
					.orElse(reactor.core.publisher.Mono.empty()))
				.doOnNext(text -> {
					System.out.print(text);
					charCount.addAndGet(text.length());
				})
				.doOnComplete(() -> {
					System.out.println();
					System.out.println("[Streamed " + charCount.get() + " characters]");
					streamLatch.countDown();
				})
				.doOnError(e -> {
					System.err.println("Stream error: " + e.getMessage());
					streamLatch.countDown();
				})
				.subscribe();

			// Wait for streaming to complete
			streamLatch.await(2, TimeUnit.MINUTES);
			System.out.println();

			// ============================================================
			// 5. SESSION WITH PRE-TOOL-USE HOOK
			// ============================================================
			System.out.println("5. Session with PreToolUse Hook:");
			System.out.println("-".repeat(50));

			// Create a hook registry with a PreToolUse hook for Bash commands
			HookRegistry hookRegistry = new HookRegistry();
			AtomicInteger bashCallCount = new AtomicInteger(0);

			hookRegistry.registerPreToolUse("Bash", (HookInput input) -> {
				int count = bashCallCount.incrementAndGet();
				System.out.println("[Hook] Bash tool intercepted (call #" + count + ")");

				// Access tool input if available
				if (input instanceof HookInput.PreToolUseInput preToolUse) {
					preToolUse.getArgument("command", String.class)
						.ifPresent(cmd -> System.out.println("[Hook] Command: " + cmd));

					// Example: Block dangerous commands
					String command = preToolUse.getArgument("command", String.class).orElse("");
					if (command.contains("rm -rf")) {
						System.out.println("[Hook] BLOCKED: Dangerous command detected!");
						return HookOutput.block("Dangerous command blocked by security policy");
					}
				}

				// Allow the tool to proceed
				System.out.println("[Hook] Allowing Bash execution");
				return HookOutput.allow();
			});

			// Build CLI options with DEFAULT permission mode (required for hooks)
			CLIOptions cliOptions = CLIOptions.builder()
				.model(CLIOptions.MODEL_HAIKU)
				.permissionMode(PermissionMode.DEFAULT)
				.build();

			// Create and use a session with hooks
			try (DefaultClaudeSession session = DefaultClaudeSession.builder()
				.workingDirectory(Path.of(System.getProperty("user.dir")))
				.options(cliOptions)
				.hookRegistry(hookRegistry)
				.timeout(Duration.ofMinutes(2))
				.build()) {

				// Connect with a prompt that triggers tool use
				session.connect("Run this bash command: echo 'Hello from hooks!'");

				// Process messages from the response
				System.out.println("\nSession response:");
				try (MessageReceiver receiver = session.responseReceiver()) {
					ParsedMessage msg;
					while ((msg = receiver.next()) != null) {
						if (msg.isRegularMessage() && msg.asMessage() instanceof AssistantMessage assistant) {
							assistant.getTextContent().ifPresent(text -> System.out.println("Claude: " + text));
						}
					}
				}
			}

			System.out.println("\n[Hook was triggered " + bashCallCount.get() + " time(s)]");
			System.out.println();

			// ============================================================
			// DONE
			// ============================================================
			System.out.println("=".repeat(50));
			System.out.println("All examples completed successfully!");

		}
		catch (Exception e) {
			System.err.println("Error: " + e.getMessage());
			e.printStackTrace();
		}
	}

}
