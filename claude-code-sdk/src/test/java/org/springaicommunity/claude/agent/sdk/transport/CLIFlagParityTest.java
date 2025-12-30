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

package org.springaicommunity.claude.agent.sdk.transport;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springaicommunity.claude.agent.sdk.config.PermissionMode;
import org.springaicommunity.claude.agent.sdk.config.PluginConfig;
import org.springaicommunity.claude.agent.sdk.mcp.McpServerConfig;

import java.nio.file.Path;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * CLI Flag Parity Tests - Ensures Java SDK passes all CLI flags that Python SDK supports.
 *
 * <p>IMPORTANT: This test class exists to prevent regressions where CLI flags are missing
 * or incorrectly passed. Two bugs were caught in tutorials due to missing flag support:</p>
 * <ul>
 *   <li>Module 09: --json-schema flag parsing was broken (structured_output not parsed)</li>
 *   <li>Module 11: --resume flag was completely missing from the SDK</li>
 * </ul>
 *
 * <p>Reference: Python SDK subprocess_cli.py _build_command() method</p>
 *
 * @see <a href="https://github.com/anthropics/claude-agent-sdk-python">Python SDK</a>
 */
@DisplayName("CLI Flag Parity Tests")
class CLIFlagParityTest {

	@TempDir
	Path tempDir;

	/**
	 * Creates a transport for testing command building.
	 */
	private StreamingTransport createTransport() {
		return new StreamingTransport(tempDir, Duration.ofMinutes(5), "/usr/bin/claude");
	}

	// ============================================================
	// Core Bidirectional Mode Flags (Always Present)
	// ============================================================

	@Nested
	@DisplayName("Core Bidirectional Mode Flags")
	class CoreBidirectionalFlags {

		@Test
		@DisplayName("--output-format stream-json is always present")
		void outputFormatStreamJson() {
			try (StreamingTransport transport = createTransport()) {
				List<String> cmd = transport.buildStreamingCommand(CLIOptions.builder().build());
				assertThat(cmd).containsSubsequence("--output-format", "stream-json");
			}
		}

		@Test
		@DisplayName("--input-format stream-json is always present")
		void inputFormatStreamJson() {
			try (StreamingTransport transport = createTransport()) {
				List<String> cmd = transport.buildStreamingCommand(CLIOptions.builder().build());
				assertThat(cmd).containsSubsequence("--input-format", "stream-json");
			}
		}

		@Test
		@DisplayName("--verbose is always present")
		void verboseAlwaysPresent() {
			try (StreamingTransport transport = createTransport()) {
				List<String> cmd = transport.buildStreamingCommand(CLIOptions.builder().build());
				assertThat(cmd).contains("--verbose");
			}
		}

	}

	// ============================================================
	// Model and Prompt Flags
	// ============================================================

	@Nested
	@DisplayName("Model and Prompt Flags")
	class ModelAndPromptFlags {

		@Test
		@DisplayName("--model flag with model ID")
		void modelFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.model("claude-sonnet-4-5-20250929")
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--model", "claude-sonnet-4-5-20250929");
			}
		}

		@Test
		@DisplayName("--system-prompt flag with custom prompt")
		void systemPromptFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.systemPrompt("You are a helpful assistant")
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--system-prompt", "You are a helpful assistant");
			}
		}

		@Test
		@DisplayName("--append-system-prompt flag")
		void appendSystemPromptFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.appendSystemPrompt("Always be concise.")
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--append-system-prompt", "Always be concise.");
			}
		}

		@Test
		@DisplayName("--fallback-model flag")
		void fallbackModelFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.fallbackModel("claude-haiku-4-5-20251001")
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--fallback-model", "claude-haiku-4-5-20251001");
			}
		}

	}

	// ============================================================
	// Tool Control Flags
	// ============================================================

	@Nested
	@DisplayName("Tool Control Flags")
	class ToolControlFlags {

		@Test
		@DisplayName("--allowedTools flag with comma-separated list")
		void allowedToolsFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.allowedTools(List.of("Bash", "Read", "Write"))
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--allowedTools", "Bash,Read,Write");
			}
		}

		@Test
		@DisplayName("--disallowedTools flag with comma-separated list")
		void disallowedToolsFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.disallowedTools(List.of("WebFetch", "WebSearch"))
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--disallowedTools", "WebFetch,WebSearch");
			}
		}

		@Test
		@DisplayName("--tools flag with base tool set")
		void toolsFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.tools(List.of("Read", "Edit"))
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--tools", "Read,Edit");
			}
		}

		@Test
		@DisplayName("--tools flag with empty list disables all tools")
		void toolsFlagEmpty() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.tools(List.of())
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				int toolsIndex = cmd.indexOf("--tools");
				assertThat(toolsIndex).isGreaterThan(-1);
				assertThat(cmd.get(toolsIndex + 1)).isEmpty();
			}
		}

	}

	// ============================================================
	// Permission Flags
	// ============================================================

	@Nested
	@DisplayName("Permission Flags")
	class PermissionFlags {

		@Test
		@DisplayName("--permission-mode bypassPermissions")
		void permissionModeBypass() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--permission-mode", "bypassPermissions");
			}
		}

		@Test
		@DisplayName("--dangerously-skip-permissions flag")
		void dangerouslySkipPermissions() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.permissionMode(PermissionMode.DANGEROUSLY_SKIP_PERMISSIONS)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).contains("--dangerously-skip-permissions");
				// Should NOT have --permission-mode when using dangerously-skip
				assertThat(cmd).doesNotContain("--permission-mode");
			}
		}

		@Test
		@DisplayName("--permission-prompt-tool flag")
		void permissionPromptToolFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.permissionPromptToolName("stdio")
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--permission-prompt-tool", "stdio");
			}
		}

	}

	// ============================================================
	// Session Resume Flags (Bug fix: Module 11)
	// ============================================================

	@Nested
	@DisplayName("Session Resume Flags")
	class SessionResumeFlags {

		@Test
		@DisplayName("--continue flag for continuing most recent session")
		void continueFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.continueConversation(true)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).contains("--continue");
			}
		}

		@Test
		@DisplayName("--resume flag with session ID")
		void resumeFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.resume("session-abc123")
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--resume", "session-abc123");
			}
		}

		@Test
		@DisplayName("--resume flag not present when null")
		void resumeFlagNotPresentWhenNull() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder().build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).doesNotContain("--resume");
			}
		}

		@Test
		@DisplayName("--continue flag not present when false")
		void continueFlagNotPresentWhenFalse() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.continueConversation(false)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).doesNotContain("--continue");
			}
		}

	}

	// ============================================================
	// Budget Control Flags
	// ============================================================

	@Nested
	@DisplayName("Budget Control Flags")
	class BudgetControlFlags {

		@Test
		@DisplayName("--max-turns flag")
		void maxTurnsFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.maxTurns(10)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--max-turns", "10");
			}
		}

		@Test
		@DisplayName("--max-budget-usd flag")
		void maxBudgetUsdFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.maxBudgetUsd(0.50)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--max-budget-usd", "0.5");
			}
		}

	}

	// ============================================================
	// Extended Thinking Flags
	// ============================================================

	@Nested
	@DisplayName("Extended Thinking Flags")
	class ExtendedThinkingFlags {

		@Test
		@DisplayName("--max-thinking-tokens flag")
		void maxThinkingTokensFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.maxThinkingTokens(10000)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--max-thinking-tokens", "10000");
			}
		}

	}

	// ============================================================
	// Structured Output Flags (Bug fix: Module 09)
	// ============================================================

	@Nested
	@DisplayName("Structured Output Flags")
	class StructuredOutputFlags {

		@Test
		@DisplayName("--json-schema flag with schema JSON")
		void jsonSchemaFlag() {
			try (StreamingTransport transport = createTransport()) {
				Map<String, Object> schema = new HashMap<>();
				schema.put("type", "object");
				schema.put("properties", Map.of(
					"answer", Map.of("type", "number"),
					"explanation", Map.of("type", "string")
				));
				schema.put("required", List.of("answer", "explanation"));

				CLIOptions options = CLIOptions.builder()
					.jsonSchema(schema)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);

				int schemaIndex = cmd.indexOf("--json-schema");
				assertThat(schemaIndex).as("--json-schema flag should be present").isGreaterThan(-1);
				String schemaJson = cmd.get(schemaIndex + 1);
				assertThat(schemaJson).contains("\"type\":\"object\"");
				assertThat(schemaJson).contains("\"answer\"");
				assertThat(schemaJson).contains("\"explanation\"");
			}
		}

	}

	// ============================================================
	// Multi-Agent Flags
	// ============================================================

	@Nested
	@DisplayName("Multi-Agent Flags")
	class MultiAgentFlags {

		@Test
		@DisplayName("--agents flag with agent definitions JSON")
		void agentsFlag() {
			try (StreamingTransport transport = createTransport()) {
				String agentsJson = """
					{
						"researcher": {
							"description": "Research agent",
							"tools": ["WebSearch"],
							"prompt": "You are a researcher"
						}
					}
					""";
				CLIOptions options = CLIOptions.builder()
					.agents(agentsJson)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).contains("--agents");
				int agentsIndex = cmd.indexOf("--agents");
				assertThat(cmd.get(agentsIndex + 1)).contains("researcher");
			}
		}

		@Test
		@DisplayName("--agents flag not present when empty")
		void agentsFlagNotPresentWhenEmpty() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.agents("")
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).doesNotContain("--agents");
			}
		}

	}

	// ============================================================
	// MCP Server Configuration Flags
	// ============================================================

	@Nested
	@DisplayName("MCP Server Configuration Flags")
	class McpServerFlags {

		@Test
		@DisplayName("--mcp-config flag with stdio server")
		void mcpConfigStdioServer() {
			try (StreamingTransport transport = createTransport()) {
				McpServerConfig.McpStdioServerConfig stdioServer = new McpServerConfig.McpStdioServerConfig(
					"npx", List.of("-y", "@modelcontextprotocol/server-filesystem"), null
				);
				CLIOptions options = CLIOptions.builder()
					.mcpServers(Map.of("filesystem", stdioServer))
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).contains("--mcp-config");
				int mcpIndex = cmd.indexOf("--mcp-config");
				String mcpJson = cmd.get(mcpIndex + 1);
				assertThat(mcpJson).contains("mcpServers");
				assertThat(mcpJson).contains("filesystem");
			}
		}

	}

	// ============================================================
	// Settings and Configuration Flags
	// ============================================================

	@Nested
	@DisplayName("Settings and Configuration Flags")
	class SettingsFlags {

		@Test
		@DisplayName("--settings flag with file path")
		void settingsFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.settings("/etc/claude/settings.json")
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--settings", "/etc/claude/settings.json");
			}
		}

		@Test
		@DisplayName("--setting-sources flag")
		void settingSourcesFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.settingSources(List.of("project", "user"))
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--setting-sources", "project,user");
			}
		}

		@Test
		@DisplayName("--add-dir flag (repeated for each directory)")
		void addDirFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.addDirs(List.of(Path.of("/workspace/libs"), Path.of("/workspace/docs")))
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);

				// Find first --add-dir
				int firstIndex = cmd.indexOf("--add-dir");
				assertThat(firstIndex).isGreaterThan(-1);
				assertThat(cmd.get(firstIndex + 1)).isEqualTo("/workspace/libs");

				// Find second --add-dir after the first
				List<String> afterFirst = cmd.subList(firstIndex + 2, cmd.size());
				int secondPos = afterFirst.indexOf("--add-dir");
				assertThat(secondPos).isGreaterThan(-1);
				assertThat(afterFirst.get(secondPos + 1)).isEqualTo("/workspace/docs");
			}
		}

	}

	// ============================================================
	// Plugin Flags
	// ============================================================

	@Nested
	@DisplayName("Plugin Flags")
	class PluginFlags {

		@Test
		@DisplayName("--plugin-dir flag for local plugins")
		void pluginDirFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.plugins(List.of(PluginConfig.local("/opt/plugins/custom")))
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--plugin-dir", "/opt/plugins/custom");
			}
		}

	}

	// ============================================================
	// Extra Args (Escape Hatch)
	// ============================================================

	@Nested
	@DisplayName("Extra Args (Escape Hatch)")
	class ExtraArgsFlags {

		@Test
		@DisplayName("Extra args with value")
		void extraArgsWithValue() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.extraArgs(Map.of("custom-flag", "custom-value"))
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).containsSubsequence("--custom-flag", "custom-value");
			}
		}

		@Test
		@DisplayName("Extra args as boolean flag (null value)")
		void extraArgsBooleanFlag() {
			try (StreamingTransport transport = createTransport()) {
				Map<String, String> extraArgs = new HashMap<>();
				extraArgs.put("debug-to-stderr", null);
				CLIOptions options = CLIOptions.builder()
					.extraArgs(extraArgs)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).contains("--debug-to-stderr");
			}
		}

	}

	// ============================================================
	// Session Control Flags
	// ============================================================

	@Nested
	@DisplayName("Session Control Flags")
	class SessionControlFlags {

		@Test
		@DisplayName("--include-partial-messages flag when enabled")
		void includePartialMessagesFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.includePartialMessages(true)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).contains("--include-partial-messages");
			}
		}

		@Test
		@DisplayName("--include-partial-messages flag not present when disabled")
		void includePartialMessagesFlagNotPresent() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.includePartialMessages(false)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).doesNotContain("--include-partial-messages");
			}
		}

		@Test
		@DisplayName("--fork-session flag when enabled")
		void forkSessionFlag() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.forkSession(true)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).contains("--fork-session");
			}
		}

		@Test
		@DisplayName("--fork-session flag not present when disabled")
		void forkSessionFlagNotPresent() {
			try (StreamingTransport transport = createTransport()) {
				CLIOptions options = CLIOptions.builder()
					.forkSession(false)
					.build();
				List<String> cmd = transport.buildStreamingCommand(options);
				assertThat(cmd).doesNotContain("--fork-session");
			}
		}

	}

	// ============================================================
	// Comprehensive Parity Test
	// ============================================================

	@Nested
	@DisplayName("Comprehensive Parity Tests")
	class ComprehensiveParityTests {

		@Test
		@DisplayName("All major flags work together")
		void allMajorFlagsTogether() {
			try (StreamingTransport transport = createTransport()) {
				Map<String, Object> schema = Map.of(
					"type", "object",
					"properties", Map.of("result", Map.of("type", "string"))
				);

				CLIOptions options = CLIOptions.builder()
					.model("claude-sonnet-4-5-20250929")
					.systemPrompt("You are a test assistant")
					.allowedTools(List.of("Bash", "Read"))
					.disallowedTools(List.of("WebFetch"))
					.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
					.maxTurns(5)
					.maxBudgetUsd(0.25)
					.maxThinkingTokens(5000)
					.jsonSchema(schema)
					.continueConversation(false)
					.resume("test-session-id")
					.fallbackModel("claude-haiku-4-5-20251001")
					.build();

				List<String> cmd = transport.buildStreamingCommand(options);

				// Verify all flags are present
				assertThat(cmd).contains("--model");
				assertThat(cmd).contains("--system-prompt");
				assertThat(cmd).contains("--allowedTools");
				assertThat(cmd).contains("--disallowedTools");
				assertThat(cmd).contains("--permission-mode");
				assertThat(cmd).contains("--max-turns");
				assertThat(cmd).contains("--max-budget-usd");
				assertThat(cmd).contains("--max-thinking-tokens");
				assertThat(cmd).contains("--json-schema");
				assertThat(cmd).contains("--resume");
				assertThat(cmd).contains("--fallback-model");
				// --continue should NOT be present when false
				assertThat(cmd).doesNotContain("--continue");
			}
		}

	}

}
