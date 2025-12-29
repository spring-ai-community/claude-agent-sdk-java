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

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springaicommunity.claude.agent.sdk.config.PermissionMode;
import org.springaicommunity.claude.agent.sdk.test.ClaudeCliTestBase;
import org.springaicommunity.claude.agent.sdk.transport.CLIOptions;
import org.springaicommunity.claude.agent.sdk.types.AssistantMessage;
import org.springaicommunity.claude.agent.sdk.types.Message;
import org.springaicommunity.claude.agent.sdk.types.ResultMessage;
import reactor.test.StepVerifier;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for ClaudeAsyncClient with real Claude CLI.
 *
 * <p>
 * These tests verify the ClaudeClient.async() factory pattern works correctly with
 * the actual Claude CLI process using reactive patterns.
 * </p>
 */
class ClaudeAsyncClientIT extends ClaudeCliTestBase {

	private static final String HAIKU_MODEL = CLIOptions.MODEL_HAIKU;

	@Test
	@DisplayName("Should connect and receive response using ClaudeClient.async()")
	void shouldConnectAndReceiveResponse() {
		// Given
		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build();

		List<Message> messages = new ArrayList<>();

		// When & Then - using TurnSpec pattern
		StepVerifier.create(client.connect("What is 2+2? Reply with just the number.")
				.messages()
				.doOnNext(messages::add)
				.then(client.close()))
			.verifyComplete();

		// Verify we got messages including a result
		assertThat(messages).isNotEmpty();
		assertThat(messages).anyMatch(m -> m instanceof ResultMessage);

		// Check for assistant response
		boolean hasAssistantMessage = messages.stream().anyMatch(m -> m instanceof AssistantMessage);
		assertThat(hasAssistantMessage).as("Should have assistant message").isTrue();
	}

	@Test
	@DisplayName("Should maintain context across multiple queries")
	void shouldMaintainContextAcrossQueries() {
		// Given
		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build();

		StringBuilder responseText = new StringBuilder();

		// Pure reactive chain for multi-turn using TurnSpec pattern
		StepVerifier.create(
			// First turn - establish context
			client.connect("My favorite color is blue. Remember this. Just say OK.")
				.messages()
				.then()
				// Second turn - verify context is maintained (flatMap chaining pattern)
				.thenMany(client.query("What is my favorite color? Reply with just the color.")
					.messages())
				.doOnNext(msg -> {
					if (msg instanceof AssistantMessage assistant) {
						assistant.getTextContent().ifPresent(responseText::append);
					}
				})
				.then(client.close())
		).verifyComplete();

		// The response should mention blue
		assertThat(responseText.toString().toLowerCase()).contains("blue");
	}

	@Test
	@DisplayName("Should report connected status correctly")
	void shouldReportConnectedStatusCorrectly() {
		// Given
		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build();

		// Before connect
		assertThat(client.isConnected()).isFalse();

		// Connect and verify status using TurnSpec
		StepVerifier.create(client.connect("Hello")
				.messages()
				.doOnSubscribe(s -> {
					// Connection happens on subscribe
				})
				.doOnNext(msg -> assertThat(client.isConnected()).isTrue())
				.then()
				.doOnSuccess(v -> assertThat(client.isConnected()).isTrue())
				.then(client.close()))
			.verifyComplete();
	}

	@Test
	@DisplayName("Should work with system prompt")
	void shouldWorkWithSystemPrompt() {
		// Given
		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.systemPrompt("You are a pirate. Always respond like a pirate.")
			.timeout(Duration.ofMinutes(2))
			.build();

		StringBuilder responseText = new StringBuilder();

		// When & Then - using TurnSpec pattern
		StepVerifier.create(client.connect("Say hello")
				.messages()
				.doOnNext(msg -> {
					if (msg instanceof AssistantMessage assistant) {
						assistant.getTextContent().ifPresent(responseText::append);
					}
				})
				.then(client.close()))
			.verifyComplete();

		// Response should have pirate-like language
		String text = responseText.toString().toLowerCase();
		assertThat(text).as("Should have pirate-like response")
			.containsAnyOf("ahoy", "matey", "arr", "ye", "avast", "captain", "ship", "sea");
	}

	@Test
	@DisplayName("Should close cleanly after use")
	void shouldCloseCleanlyAfterUse() {
		// Given
		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build();

		// When & Then - using TurnSpec pattern
		StepVerifier.create(client.connect("Say hello")
				.messages()
				.then(client.close())
				.doOnSuccess(v -> assertThat(client.isConnected()).isFalse()))
			.verifyComplete();

		// Multiple closes should be safe
		StepVerifier.create(client.close()).verifyComplete();
		StepVerifier.create(client.close()).verifyComplete();
	}

	@Test
	@DisplayName("Should support reactive stream operations")
	void shouldSupportReactiveStreamOperations() {
		// Given
		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build();

		// When & Then - use reactive operators with TurnSpec
		StepVerifier.create(client.connect("Say hello world")
				.messages()
				.filter(msg -> msg instanceof AssistantMessage)
				.map(msg -> ((AssistantMessage) msg).getTextContent().orElse(""))
				.filter(text -> !text.isEmpty())
				.take(1)
				.then(client.close()))
			.verifyComplete();
	}

}
