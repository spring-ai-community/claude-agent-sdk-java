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

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springaicommunity.claude.agent.sdk.test.ClaudeCliTestBase;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * CLI Flag Parity Integration Test - Uses CLI's --help as the golden standard.
 *
 * <p>This test extracts all available flags from the Claude CLI's --help output
 * and verifies that the Java SDK's CLIOptions supports them. When the CLI adds
 * new flags, this test will fail, reminding us to add SDK support.</p>
 *
 * <p>Background: Two tutorial modules failed due to missing flag support:</p>
 * <ul>
 *   <li>Module 09: --json-schema parsing was broken</li>
 *   <li>Module 11: --resume flag was completely missing</li>
 * </ul>
 */
@DisplayName("CLI Flag Parity IT")
class CLIFlagParityIT extends ClaudeCliTestBase {

	private static Set<String> cliFlags;
	private static String cliHelpOutput;

	/**
	 * Flags that are intentionally NOT supported by the SDK.
	 * Each exclusion must have a documented reason.
	 */
	private static final Set<String> EXCLUDED_FLAGS = Set.of(
		// Interactive/UI flags - not applicable to SDK usage
		"help", "h",
		"version", "v",
		"debug", "d",
		"print", "p",  // SDK always uses stream-json mode
		"ide",
		"chrome", "no-chrome",
		"disable-slash-commands",

		// Deprecated flags
		"mcp-debug",

		// Session management handled differently in SDK
		"no-session-persistence",
		"session-id",
		"replay-user-messages",

		// Security flag that requires special handling
		"allow-dangerously-skip-permissions",

		// Config flags handled via CLIOptions fields
		"strict-mcp-config",

		// Agent selection (different from --agents for custom agents)
		"agent",

		// API configuration
		"betas",

		// Always added by SDK automatically
		"verbose"
	);

	/**
	 * Mapping from CLI flag names to CLIOptions builder method names.
	 * Only needed when names don't match directly.
	 */
	private static final java.util.Map<String, String> FLAG_TO_METHOD = java.util.Map.ofEntries(
		java.util.Map.entry("continue", "continueConversation"),
		java.util.Map.entry("c", "continueConversation"),
		java.util.Map.entry("r", "resume"),
		java.util.Map.entry("allowed-tools", "allowedTools"),
		java.util.Map.entry("disallowed-tools", "disallowedTools"),
		java.util.Map.entry("add-dir", "addDirs"),
		java.util.Map.entry("plugin-dir", "plugins"),
		java.util.Map.entry("mcp-config", "mcpServers"),
		java.util.Map.entry("output-format", "outputFormat"),
		java.util.Map.entry("input-format", "outputFormat"),  // Handled internally
		java.util.Map.entry("system-prompt", "systemPrompt"),
		java.util.Map.entry("append-system-prompt", "appendSystemPrompt"),
		java.util.Map.entry("json-schema", "jsonSchema"),
		java.util.Map.entry("max-budget-usd", "maxBudgetUsd"),
		java.util.Map.entry("max-thinking-tokens", "maxThinkingTokens"),
		java.util.Map.entry("permission-mode", "permissionMode"),
		java.util.Map.entry("permission-prompt-tool", "permissionPromptToolName"),
		java.util.Map.entry("fallback-model", "fallbackModel"),
		java.util.Map.entry("fork-session", "forkSession"),
		java.util.Map.entry("include-partial-messages", "includePartialMessages"),
		java.util.Map.entry("setting-sources", "settingSources"),
		java.util.Map.entry("max-turns", "maxTurns"),
		java.util.Map.entry("dangerously-skip-permissions", "permissionMode")  // Handled via PermissionMode enum
	);

	@BeforeAll
	static void extractCliFlagsFromHelp() throws Exception {
		ProcessBuilder pb = new ProcessBuilder("claude", "--help");
		pb.redirectErrorStream(true);
		Process process = pb.start();

		try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
			cliHelpOutput = reader.lines().collect(Collectors.joining("\n"));
		}

		int exitCode = process.waitFor();
		assertThat(exitCode).as("claude --help should succeed").isZero();

		cliFlags = parseFlags(cliHelpOutput);
	}

	/**
	 * Parses flag names from CLI help output.
	 * Matches patterns like: -c, --continue, --model <model>, --tools <tools...>
	 */
	private static Set<String> parseFlags(String helpOutput) {
		Set<String> flags = new HashSet<>();

		// Pattern to match flags: -x, --flag-name, --flag-name <value>
		Pattern pattern = Pattern.compile("--([a-zA-Z][a-zA-Z0-9-]*)");
		Matcher matcher = pattern.matcher(helpOutput);

		while (matcher.find()) {
			flags.add(matcher.group(1));
		}

		// Also extract short flags
		Pattern shortPattern = Pattern.compile("\\s-([a-zA-Z]),");
		Matcher shortMatcher = shortPattern.matcher(helpOutput);
		while (shortMatcher.find()) {
			flags.add(shortMatcher.group(1));
		}

		return flags;
	}

	@Test
	@DisplayName("All CLI flags should have SDK support or be explicitly excluded")
	void allCliFlagsShouldHaveSdkSupport() {
		Set<String> builderMethods = getBuilderMethodNames();
		Set<String> unsupportedFlags = new HashSet<>();

		for (String flag : cliFlags) {
			if (EXCLUDED_FLAGS.contains(flag)) {
				continue;  // Intentionally excluded
			}

			String methodName = FLAG_TO_METHOD.getOrDefault(flag, toCamelCase(flag));

			if (!builderMethods.contains(methodName)) {
				unsupportedFlags.add(flag);
			}
		}

		assertThat(unsupportedFlags)
			.as("All CLI flags should have corresponding CLIOptions builder methods. " +
				"Either add support or add to EXCLUDED_FLAGS with justification. " +
				"Unsupported flags: " + unsupportedFlags)
			.isEmpty();
	}

	@Test
	@DisplayName("CLI help should be parseable")
	void cliHelpShouldBeParseable() {
		assertThat(cliFlags).isNotEmpty();
		assertThat(cliFlags).contains("model", "resume", "continue", "json-schema");
	}

	@Test
	@DisplayName("Critical SDK flags should be in CLI")
	void criticalSdkFlagsShouldBeInCli() {
		// These are flags we know we support - verify CLI still has them
		// Note: Some flags like max-turns and max-thinking-tokens work but aren't in --help
		List<String> criticalFlags = List.of(
			"model",
			"system-prompt",
			"allowedTools",
			"disallowedTools",
			"permission-mode",
			"resume",
			"continue",
			"json-schema",
			"max-budget-usd",
			"agents",
			"mcp-config",
			"fallback-model",
			"fork-session",
			"settings"
		);

		for (String flag : criticalFlags) {
			assertThat(cliFlags)
				.as("CLI should support flag: " + flag)
				.contains(flag);
		}
	}

	@Test
	@DisplayName("Report CLI flags found for documentation")
	void reportCliFlagsFound() {
		System.out.println("=== CLI Flags Found ===");
		cliFlags.stream().sorted().forEach(flag -> {
			String status = EXCLUDED_FLAGS.contains(flag) ? " [EXCLUDED]" : "";
			String methodName = FLAG_TO_METHOD.getOrDefault(flag, toCamelCase(flag));
			System.out.printf("  --%s -> %s%s%n", flag, methodName, status);
		});
		System.out.println("Total: " + cliFlags.size() + " flags");
		System.out.println("Excluded: " + EXCLUDED_FLAGS.size() + " flags");
	}

	/**
	 * Gets all builder method names from CLIOptions.Builder.
	 */
	private Set<String> getBuilderMethodNames() {
		Set<String> methods = new HashSet<>();
		for (Method method : CLIOptions.Builder.class.getDeclaredMethods()) {
			if (method.getReturnType().equals(CLIOptions.Builder.class)) {
				methods.add(method.getName());
			}
		}
		return methods;
	}

	/**
	 * Converts kebab-case to camelCase.
	 */
	private String toCamelCase(String kebab) {
		StringBuilder sb = new StringBuilder();
		boolean capitalizeNext = false;
		for (char c : kebab.toCharArray()) {
			if (c == '-') {
				capitalizeNext = true;
			} else if (capitalizeNext) {
				sb.append(Character.toUpperCase(c));
				capitalizeNext = false;
			} else {
				sb.append(c);
			}
		}
		return sb.toString();
	}

}
