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

package org.springaicommunity.claude.agent.examples.research;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springaicommunity.claude.agent.sdk.hooks.HookRegistry;
import org.springaicommunity.claude.agent.sdk.types.control.HookEvent;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for Research Agent components.
 * These tests verify the AgentDefinition and SubagentTracker without requiring the actual CLI.
 */
class ResearchAgentTest {

	@Nested
	@DisplayName("AgentDefinition")
	class AgentDefinitionTests {

		@Test
		@DisplayName("Should build with all properties")
		void buildWithAllProperties() {
			AgentDefinition agent = AgentDefinition.builder()
				.description("Test researcher agent")
				.tools("WebSearch", "Write")
				.prompt("You are a researcher")
				.model("haiku")
				.build();

			assertThat(agent.description()).isEqualTo("Test researcher agent");
			assertThat(agent.tools()).containsExactly("WebSearch", "Write");
			assertThat(agent.prompt()).isEqualTo("You are a researcher");
			assertThat(agent.model()).isEqualTo("haiku");
		}

		@Test
		@DisplayName("Should handle varargs tools")
		void handleVarargsTools() {
			AgentDefinition agent = AgentDefinition.builder()
				.description("Multi-tool agent")
				.tools("Read", "Write", "Glob", "Grep")
				.prompt("You can use many tools")
				.model("sonnet")
				.build();

			assertThat(agent.tools()).hasSize(4);
			assertThat(agent.tools()).containsExactly("Read", "Write", "Glob", "Grep");
		}

		@Test
		@DisplayName("Should handle list of tools")
		void handleListOfTools() {
			List<String> tools = List.of("WebSearch", "Read");

			AgentDefinition agent = AgentDefinition.builder()
				.description("Agent with list tools")
				.tools(tools)
				.prompt("Test prompt")
				.model("haiku")
				.build();

			assertThat(agent.tools()).isEqualTo(tools);
		}

		@Test
		@DisplayName("Should serialize agents to JSON for CLI --agents parameter")
		void serializeToJson() {
			Map<String, AgentDefinition> agents = Map.of(
				"researcher", AgentDefinition.builder()
					.description("Research agent")
					.tools("WebSearch", "Write")
					.prompt("You are a researcher")
					.model("haiku")
					.build(),
				"writer", AgentDefinition.builder()
					.description("Report writer")
					.tools("Read", "Write")
					.prompt("You write reports")
					.model("haiku")
					.build()
			);

			String json = AgentDefinition.toJson(agents);

			// Verify JSON structure
			assertThat(json).isNotEmpty();
			assertThat(json).contains("\"researcher\"");
			assertThat(json).contains("\"writer\"");
			assertThat(json).contains("\"description\"");
			assertThat(json).contains("\"tools\"");
			assertThat(json).contains("\"prompt\"");
			assertThat(json).contains("\"model\"");
			assertThat(json).contains("WebSearch");
			assertThat(json).contains("You are a researcher");
		}

	}

	@Nested
	@DisplayName("SubagentTracker")
	class SubagentTrackerTests {

		@TempDir
		Path tempDir;

		@Test
		@DisplayName("Should create session directory path")
		void createSessionDirectory() throws IOException {
			Path sessionDir = SubagentTracker.createSessionDir(tempDir);

			// createSessionDir only returns the path, SubagentTracker constructor creates it
			assertThat(sessionDir.getFileName().toString()).startsWith("session_");
			assertThat(sessionDir.getParent()).isEqualTo(tempDir);
		}

		@Test
		@DisplayName("Should create hook registry with PreToolUse and PostToolUse")
		void createHookRegistry() throws IOException {
			Path sessionDir = SubagentTracker.createSessionDir(tempDir);

			try (SubagentTracker tracker = new SubagentTracker(sessionDir)) {
				HookRegistry registry = tracker.createHookRegistry();

				assertThat(registry.hasHooks()).isTrue();
				assertThat(registry.getByEvent(HookEvent.PRE_TOOL_USE)).hasSize(1);
				assertThat(registry.getByEvent(HookEvent.POST_TOOL_USE)).hasSize(1);
			}
		}

		@Test
		@DisplayName("Should create log file on initialization")
		void createLogFile() throws IOException {
			Path sessionDir = SubagentTracker.createSessionDir(tempDir);

			try (SubagentTracker tracker = new SubagentTracker(sessionDir)) {
				Path logFile = sessionDir.resolve("tool_calls.jsonl");
				assertThat(logFile).exists();
			}
		}

		@Test
		@DisplayName("Should close cleanly")
		void closeCleanly() throws IOException {
			Path sessionDir = SubagentTracker.createSessionDir(tempDir);
			SubagentTracker tracker = new SubagentTracker(sessionDir);

			// Should not throw
			tracker.close();
		}

	}

	@Nested
	@DisplayName("Prompt Loading")
	class PromptLoadingTests {

		@Test
		@DisplayName("Should find lead_agent.txt on classpath")
		void findLeadAgentPrompt() {
			var stream = ResearchAgentTest.class.getResourceAsStream("/prompts/lead_agent.txt");
			assertThat(stream).isNotNull();
		}

		@Test
		@DisplayName("Should find researcher.txt on classpath")
		void findResearcherPrompt() {
			var stream = ResearchAgentTest.class.getResourceAsStream("/prompts/researcher.txt");
			assertThat(stream).isNotNull();
		}

		@Test
		@DisplayName("Should find report_writer.txt on classpath")
		void findReportWriterPrompt() {
			var stream = ResearchAgentTest.class.getResourceAsStream("/prompts/report_writer.txt");
			assertThat(stream).isNotNull();
		}

	}

}
