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

import org.springaicommunity.claude.agent.sdk.config.PermissionMode;
import org.springaicommunity.claude.agent.sdk.hooks.HookRegistry;
import org.springaicommunity.claude.agent.sdk.parsing.ParsedMessage;
import org.springaicommunity.claude.agent.sdk.session.DefaultClaudeSession;
import org.springaicommunity.claude.agent.sdk.streaming.MessageReceiver;
import org.springaicommunity.claude.agent.sdk.transport.CLIOptions;
import org.springaicommunity.claude.agent.sdk.types.AssistantMessage;
import org.springaicommunity.claude.agent.sdk.types.TextBlock;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

/**
 * Multi-agent research coordinator demonstrating AgentDefinition and Task tool.
 *
 * <p>
 * This example shows how to build a research system where a lead agent coordinates
 * specialized subagents (researcher and report-writer) using the Task tool. It
 * demonstrates:
 * </p>
 * <ul>
 * <li>AgentDefinition - Defining specialized subagents</li>
 * <li>Task tool - Spawning subagents with specific prompts</li>
 * <li>Hooks - Tracking tool calls across all agents</li>
 * <li>Multi-turn sessions - Interactive conversation with the lead agent</li>
 * </ul>
 *
 * <p>
 * Usage: Run the main method and enter research topics. The lead agent will break down
 * the topic into subtopics, spawn researcher subagents in parallel, then spawn a
 * report-writer to synthesize findings.
 * </p>
 */
public class ResearchAgent {

	private static final String PROMPTS_CLASSPATH = "/prompts/";

	private static final Path LOGS_DIR = Path.of("logs");

	private static final Path FILES_DIR = Path.of("files");

	public static void main(String[] args) {
		System.out.println("\n=== Research Agent ===");
		System.out.println("Ask me to research any topic, gather information, or analyze documents.");
		System.out.println("Type 'exit' or 'quit' to end.\n");

		// Note: ANTHROPIC_API_KEY can be set in env or Claude CLI config
		if (System.getenv("ANTHROPIC_API_KEY") == null) {
			System.out.println("Note: ANTHROPIC_API_KEY not in environment - using Claude CLI config");
		}

		try {
			// Setup directories
			Files.createDirectories(FILES_DIR.resolve("research_notes"));
			Files.createDirectories(FILES_DIR.resolve("reports"));

			// Create session directory for logs
			Path sessionDir = SubagentTracker.createSessionDir(LOGS_DIR);

			// Load prompts
			String leadAgentPrompt = loadPrompt("lead_agent.txt");
			String researcherPrompt = loadPrompt("researcher.txt");
			String reportWriterPrompt = loadPrompt("report_writer.txt");

			// Define specialized subagents
			Map<String, AgentDefinition> agents = Map.of("researcher",
					AgentDefinition.builder()
						.description("Use this agent when you need to gather research information on any topic. "
								+ "The researcher uses web search to find relevant information, articles, and sources "
								+ "from across the internet. Writes research findings to files/research_notes/ "
								+ "for later use by report writers.")
						.tools("WebSearch", "Write")
						.prompt(researcherPrompt)
						.model("haiku")
						.build(),
					"report-writer",
					AgentDefinition.builder()
						.description("Use this agent when you need to create a formal research report document. "
								+ "The report-writer reads research findings from files/research_notes/ and synthesizes "
								+ "them into clear, concise, professionally formatted reports in files/reports/. "
								+ "Does NOT conduct web searches - only reads existing research notes and creates reports.")
						.tools("Write", "Glob", "Read")
						.prompt(reportWriterPrompt)
						.model("haiku")
						.build());

			System.out.println("Registered subagents: " + String.join(", ", agents.keySet()));
			System.out.println("Session logs: " + sessionDir);

			// Initialize tracker with hooks
			try (SubagentTracker tracker = new SubagentTracker(sessionDir)) {
				HookRegistry hookRegistry = tracker.createHookRegistry();

				// Convert agents to JSON for CLI
				String agentsJson = AgentDefinition.toJson(agents);

				// Build CLI options with agent definitions
				// Use --tools to set base tools and --allowedTools to filter
				// This ensures lead agent can ONLY use Task tool for spawning subagents
				CLIOptions cliOptions = CLIOptions.builder()
					.model(CLIOptions.MODEL_HAIKU)
					.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
					.systemPrompt(leadAgentPrompt)
					.tools(List.of("Task"))  // Base set of tools - only Task
					.allowedTools(List.of("Task"))  // Filter to only Task
					.settingSources(List.of("project"))
					.agents(agentsJson)
					.build();

				// Create session with hooks
				try (DefaultClaudeSession session = DefaultClaudeSession.builder()
					.workingDirectory(Path.of(System.getProperty("user.dir")))
					.options(cliOptions)
					.hookRegistry(hookRegistry)
					.build()) {

					// Interactive loop
					BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

					while (true) {
						System.out.print("\nYou: ");
						String input = reader.readLine();

						if (input == null || input.isBlank() || input.equalsIgnoreCase("exit")
								|| input.equalsIgnoreCase("quit") || input.equalsIgnoreCase("q")) {
							break;
						}

						// Send query
						if (!session.isConnected()) {
							session.connect(input);
						}
						else {
							session.query(input);
						}

						// Process response
						System.out.print("\nAgent: ");
						try (MessageReceiver receiver = session.responseReceiver()) {
							ParsedMessage msg;
							while ((msg = receiver.next()) != null) {
								if (msg.isRegularMessage() && msg.asMessage() instanceof AssistantMessage assistant) {
									// Print text content
									for (var block : assistant.content()) {
										if (block instanceof TextBlock textBlock) {
											System.out.print(textBlock.text());
										}
									}
								}
							}
						}
						System.out.println();
					}
				}

				System.out.println("\nGoodbye!");
				System.out.println("Session logs saved to: " + sessionDir);
			}
		}
		catch (Exception e) {
			System.err.println("Error: " + e.getMessage());
			e.printStackTrace();
		}
	}

	private static String loadPrompt(String filename) throws IOException {
		String resourcePath = PROMPTS_CLASSPATH + filename;
		try (var stream = ResearchAgent.class.getResourceAsStream(resourcePath)) {
			if (stream == null) {
				throw new IOException("Prompt file not found on classpath: " + resourcePath);
			}
			return new String(stream.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8).trim();
		}
	}

}
