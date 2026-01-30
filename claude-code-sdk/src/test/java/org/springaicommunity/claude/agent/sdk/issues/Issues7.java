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

package org.springaicommunity.claude.agent.sdk.issues;

import org.junit.jupiter.api.*;
import org.springaicommunity.claude.agent.sdk.ClaudeClient;
import org.springaicommunity.claude.agent.sdk.ClaudeSyncClient;
import org.springaicommunity.claude.agent.sdk.config.PermissionMode;
import org.springaicommunity.claude.agent.sdk.parsing.ParsedMessage;
import org.springaicommunity.claude.agent.sdk.types.AssistantMessage;
import org.springaicommunity.claude.agent.sdk.types.SystemMessage;

import java.nio.file.Path;
import java.util.Iterator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

/**
 * Issue #7: PermissionMode does not work correctly when systemPrompt contains newline character on Windows.
 *
 * <h2>Problem Description:</h2>
 * When using {@code systemPrompt} with a newline character ({@code \n}) on Windows,
 * the {@code PermissionMode} is not applied correctly and defaults to {@code default}
 * instead of the configured {@code bypassPermissions}.
 *
 * <h2>Test Scenarios:</h2>
 * <ul>
 *   <li>System prompt without newline: works correctly</li>
 *   <li>System prompt with newline: fails on Windows (should return bypassPermissions but returns default)</li>
 * </ul>
 *
 * @see <a href="https://github.com/anthropics/claude-agent-sdk-java/issues/7">Issue #7</a>
 */
@DisplayName("Issue #7: PermissionMode with newline in systemPrompt on Windows")
public class Issues7 {

    public static final String MODEL_HAIKU = "claude-haiku-4-5-20251001";
    private static final String SYSTEM_PROMPT_WITHOUT_NEWLINE = "You are an AI assistant.";
    private static final String SYSTEM_PROMPT_WITH_NEWLINE = "You are an AI assistant.\n";
    private static final boolean IS_WINDOWS = System.getProperty("os.name").toLowerCase().contains("win");

    @Nested
    @DisplayName("On Windows system")
    class WindowsTests {

        @BeforeEach
        void assumeWindows() {
            assumeTrue(IS_WINDOWS,
                    "These tests should only run on Windows. Current OS: " + System.getProperty("os.name"));
        }

        @Test
        @DisplayName("should apply bypassPermissions when systemPrompt contains single newline character")
        void shouldApplyBypassPermissionsWhenSystemPromptContainsSingleNewline() {
            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .systemPrompt(SYSTEM_PROMPT_WITH_NEWLINE)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' even when systemPrompt contains single newline")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions when systemPrompt does not contain newline character")
        void shouldApplyBypassPermissionsWhenSystemPromptDoesNotContainNewline() {
            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .systemPrompt(SYSTEM_PROMPT_WITHOUT_NEWLINE)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' when systemPrompt has no newline")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions when systemPrompt contains multiple newline characters")
        void shouldApplyBypassPermissionsWhenSystemPromptContainsMultipleNewlines() {
            String systemPromptWithMultipleNewlines = "You are an AI assistant.\n\nBehave helpfully.\n";

            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .systemPrompt(systemPromptWithMultipleNewlines)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' even when systemPrompt contains multiple newlines")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions when systemPrompt contains newline in the middle")
        void shouldApplyBypassPermissionsWhenSystemPromptContainsNewlineInMiddle() {
            String systemPromptWithNewlineInMiddle = "You are an\nAI assistant.";

            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .systemPrompt(systemPromptWithNewlineInMiddle)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' when systemPrompt contains newline in the middle")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions when systemPrompt contains Windows line separator")
        void shouldApplyBypassPermissionsWhenSystemPromptContainsWindowsLineSeparator() {
            String systemPromptWithWindowsSeparator = "You are an AI assistant.\r\n";

            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .systemPrompt(systemPromptWithWindowsSeparator)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' when systemPrompt contains Windows line separator (\\r\\n)")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions without systemPrompt")
        void shouldApplyBypassPermissionsWithoutSystemPrompt() {
            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' when no systemPrompt is set")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions when appendSystemPrompt contains newline character")
        void shouldApplyBypassPermissionsWhenAppendSystemPromptContainsNewline() {
            String appendSystemPromptWithNewline = "Be concise and helpful.\n";

            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .appendSystemPrompt(appendSystemPromptWithNewline)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' when appendSystemPrompt contains newline")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions when appendSystemPrompt does not contain newline character")
        void shouldApplyBypassPermissionsWhenAppendSystemPromptDoesNotContainNewline() {
            String appendSystemPromptWithoutNewline = "Be concise and helpful.";

            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .appendSystemPrompt(appendSystemPromptWithoutNewline)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' when appendSystemPrompt has no newline")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions when both systemPrompt and appendSystemPrompt contain newlines")
        void shouldApplyBypassPermissionsWhenBothSystemPromptAndAppendSystemPromptContainNewlines() {
            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .systemPrompt(SYSTEM_PROMPT_WITH_NEWLINE)
                    .appendSystemPrompt("Be concise.\n")
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' when both systemPrompt and appendSystemPrompt contain newlines")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should apply bypassPermissions when appendSystemPrompt contains Windows line separator")
        void shouldApplyBypassPermissionsWhenAppendSystemPromptContainsWindowsLineSeparator() {
            String appendSystemPromptWithWindowsSeparator = "Be concise and helpful.\r\n";

            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .appendSystemPrompt(appendSystemPromptWithWindowsSeparator)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundSystemMessage = false;
                while (response.hasNext()) {
                    ParsedMessage msg = response.next();
                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' when appendSystemPrompt contains Windows line separator (\\r\\n)")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();
            }
        }

        @Test
        @DisplayName("should return correct JSON format when systemPrompt contains text block with newlines")
        void shouldReturnCorrectJsonFormatWhenSystemPromptContainsTextBlockWithNewlines() {
            String systemPromptTextBlock = """
                    If you receive "hi", return a strict JSON string:
                    ```json
                    {
                        "result": "hi"
                    }
                    ```
                    """;

            try (ClaudeSyncClient client = ClaudeClient.sync()
                    .workingDirectory(Path.of("."))
                    .model(MODEL_HAIKU)
                    .systemPrompt(systemPromptTextBlock)
                    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
                    .build()) {

                client.connect("hi");
                Iterator<ParsedMessage> response = client.receiveResponse();

                boolean foundAssistantMessage = false;
                boolean foundSystemMessage = false;

                while (response.hasNext()) {
                    ParsedMessage msg = response.next();

                    if (msg.isRegularMessage() && msg.asMessage() instanceof SystemMessage system) {
                        String permissionMode = (String) system.data().get("permissionMode");
                        assertThat(permissionMode)
                                .as("PermissionMode should be 'bypassPermissions' even when systemPrompt contains text block with newlines")
                                .isEqualTo("bypassPermissions");
                        foundSystemMessage = true;
                    }

                    if (msg.isRegularMessage() && msg.asMessage() instanceof AssistantMessage assistantMessage) {
                        assertThat(assistantMessage.toString().replaceAll("\n|\r\n|\s+", ""))
                                .as("Should return the specified JSON format")
                                .isEqualTo("```json{\"result\":\"hi\"}```");
                        foundAssistantMessage = true;
                    }
                }

                assertThat(foundSystemMessage)
                        .as("Should have found a SystemMessage in the response")
                        .isTrue();

                assertThat(foundAssistantMessage)
                        .as("Should have found an AssistantMessage in the response")
                        .isTrue();
            }
        }
    }
}
