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
import org.springaicommunity.claude.agent.sdk.parsing.ParsedMessage;
import org.springaicommunity.claude.agent.sdk.test.ClaudeCliTestBase;
import org.springaicommunity.claude.agent.sdk.transport.CLIOptions;
import org.springaicommunity.claude.agent.sdk.types.AssistantMessage;
import org.springaicommunity.claude.agent.sdk.types.Message;
import org.springaicommunity.claude.agent.sdk.types.ResultMessage;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for ClaudeSyncClient with real Claude CLI.
 *
 * <p>
 * These tests verify the new ClaudeClient.sync() factory pattern works correctly with
 * the actual Claude CLI process.
 * </p>
 */
class ClaudeSyncClientIT extends ClaudeCliTestBase {

	private static final String HAIKU_MODEL = CLIOptions.MODEL_HAIKU;

	@Test
	@DisplayName("Should connect and receive response using ClaudeClient.sync()")
	void shouldConnectAndReceiveResponse() {
		// Given
		try (ClaudeSyncClient client = ClaudeClient.sync()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build()) {

			// When
			client.connect("What is 2+2? Reply with just the number.");

			// Then
			List<Message> messages = new ArrayList<>();
			Iterator<ParsedMessage> response = client.receiveResponse();
			while (response.hasNext()) {
				ParsedMessage parsed = response.next();
				if (parsed.isRegularMessage()) {
					messages.add(parsed.asMessage());
				}
			}

			// Verify we got messages including a result
			assertThat(messages).isNotEmpty();
			assertThat(messages).anyMatch(m -> m instanceof ResultMessage);

			// Check for assistant response
			boolean hasAssistantMessage = messages.stream().anyMatch(m -> m instanceof AssistantMessage);
			assertThat(hasAssistantMessage).as("Should have assistant message").isTrue();
		}
	}

	@Test
	@DisplayName("Should maintain context across multiple queries")
	void shouldMaintainContextAcrossQueries() {
		// Given
		try (ClaudeSyncClient client = ClaudeClient.sync()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build()) {

			// First query - establish context
			client.connect("My favorite color is blue. Remember this. Just say OK.");

			// Consume first response
			Iterator<ParsedMessage> firstResponse = client.receiveResponse();
			while (firstResponse.hasNext()) {
				firstResponse.next();
			}

			// Second query - verify context is maintained
			client.query("What is my favorite color? Reply with just the color.");

			// Consume second response and check for "blue"
			StringBuilder responseText = new StringBuilder();
			Iterator<ParsedMessage> secondResponse = client.receiveResponse();
			while (secondResponse.hasNext()) {
				ParsedMessage parsed = secondResponse.next();
				if (parsed.isRegularMessage()) {
					Message msg = parsed.asMessage();
					if (msg instanceof AssistantMessage assistant) {
						assistant.getTextContent().ifPresent(responseText::append);
					}
				}
			}

			// The response should mention blue
			assertThat(responseText.toString().toLowerCase()).contains("blue");
		}
	}

	@Test
	@DisplayName("Should report connected status correctly")
	void shouldReportConnectedStatusCorrectly() {
		// Given
		try (ClaudeSyncClient client = ClaudeClient.sync()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build()) {

			// Before connect
			assertThat(client.isConnected()).isFalse();

			// Connect
			client.connect("Hello");

			// After connect
			assertThat(client.isConnected()).isTrue();

			// Consume response
			Iterator<ParsedMessage> response = client.receiveResponse();
			while (response.hasNext()) {
				response.next();
			}

			// Still connected after response
			assertThat(client.isConnected()).isTrue();
		}
	}

	@Test
	@DisplayName("Should work with system prompt")
	void shouldWorkWithSystemPrompt() {
		// Given
		try (ClaudeSyncClient client = ClaudeClient.sync()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.systemPrompt("You are a pirate. Always respond like a pirate.")
			.timeout(Duration.ofMinutes(2))
			.build()) {

			// When
			client.connect("Say hello");

			// Then
			StringBuilder responseText = new StringBuilder();
			Iterator<ParsedMessage> response = client.receiveResponse();
			while (response.hasNext()) {
				ParsedMessage parsed = response.next();
				if (parsed.isRegularMessage()) {
					Message msg = parsed.asMessage();
					if (msg instanceof AssistantMessage assistant) {
						assistant.getTextContent().ifPresent(responseText::append);
					}
				}
			}

			// Response should have pirate-like language
			String text = responseText.toString().toLowerCase();
			assertThat(text).as("Should have pirate-like response")
				.containsAnyOf("ahoy", "matey", "arr", "ye", "avast", "captain", "ship", "sea");
		}
	}

	@Test
	@DisplayName("Should close cleanly after use")
	void shouldCloseCleanlyAfterUse() {
		// Given
		ClaudeSyncClient client = ClaudeClient.sync()
			.workingDirectory(workingDirectory())
			.claudePath(getClaudeCliPath())
			.model(HAIKU_MODEL)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.timeout(Duration.ofMinutes(2))
			.build();

		// When
		client.connect("Say hello");
		Iterator<ParsedMessage> response = client.receiveResponse();
		while (response.hasNext()) {
			response.next();
		}

		// Close
		client.close();

		// Then
		assertThat(client.isConnected()).isFalse();

		// Multiple closes should be safe
		client.close();
		client.close();
	}

}
