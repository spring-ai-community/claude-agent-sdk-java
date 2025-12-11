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

import org.springaicommunity.claude.agent.sdk.config.PermissionMode;
import org.springaicommunity.claude.agent.sdk.transport.CLIOptions;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;

/**
 * Simplified configuration options for one-shot queries. This class provides a minimal
 * set of options needed for typical query use cases.
 *
 * <p>
 * For advanced features like hooks, MCP servers, or multi-turn sessions, use
 * {@link org.springaicommunity.claude.agent.sdk.session.ClaudeSession} instead.
 *
 * <p>
 * Example usage:
 *
 * <pre>{@code
 * // Simple query with defaults
 * String answer = Query.text("What is 2+2?");
 *
 * // With options
 * QueryResult result = Query.execute("Explain recursion",
 *     QueryOptions.builder()
 *         .model("claude-sonnet-4-5-20250929")
 *         .systemPrompt("Be concise")
 *         .timeout(Duration.ofMinutes(5))
 *         .build());
 * }</pre>
 *
 * @see Query
 * @see CLIOptions
 */
public record QueryOptions(String model, String systemPrompt, String appendSystemPrompt, Duration timeout,
		List<String> allowedTools, List<String> disallowedTools, Integer maxTurns, Double maxBudgetUsd,
		Path workingDirectory) {

	/** Default timeout for queries. */
	public static final Duration DEFAULT_TIMEOUT = Duration.ofMinutes(2);

	/** Default working directory (current directory). */
	public static final Path DEFAULT_WORKING_DIRECTORY = Paths.get(System.getProperty("user.dir"));

	public QueryOptions {
		if (timeout == null) {
			timeout = DEFAULT_TIMEOUT;
		}
		if (allowedTools == null) {
			allowedTools = List.of();
		}
		if (disallowedTools == null) {
			disallowedTools = List.of();
		}
		if (workingDirectory == null) {
			workingDirectory = DEFAULT_WORKING_DIRECTORY;
		}
	}

	/**
	 * Returns default options suitable for most queries.
	 */
	public static QueryOptions defaults() {
		return new QueryOptions(null, null, null, DEFAULT_TIMEOUT, List.of(), List.of(), null, null,
				DEFAULT_WORKING_DIRECTORY);
	}

	/**
	 * Creates a new builder for QueryOptions.
	 */
	public static Builder builder() {
		return new Builder();
	}

	/**
	 * Converts these simplified options to full CLIOptions for internal use.
	 */
	public CLIOptions toCLIOptions() {
		CLIOptions.Builder builder = CLIOptions.builder()
			.model(model)
			.timeout(timeout)
			.allowedTools(allowedTools)
			.disallowedTools(disallowedTools)
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS);

		if (systemPrompt != null) {
			builder.systemPrompt(systemPrompt);
		}

		if (appendSystemPrompt != null) {
			builder.appendSystemPrompt(appendSystemPrompt);
		}

		if (maxTurns != null) {
			builder.maxTurns(maxTurns);
		}

		if (maxBudgetUsd != null) {
			builder.maxBudgetUsd(maxBudgetUsd);
		}

		return builder.build();
	}

	public static class Builder {

		private String model;

		private String systemPrompt;

		private String appendSystemPrompt;

		private Duration timeout = DEFAULT_TIMEOUT;

		private List<String> allowedTools = List.of();

		private List<String> disallowedTools = List.of();

		private Integer maxTurns;

		private Double maxBudgetUsd;

		private Path workingDirectory = DEFAULT_WORKING_DIRECTORY;

		/**
		 * Sets the model to use. Common options: "claude-sonnet-4-5-20250929",
		 * "claude-opus-4-5-20251101", "claude-haiku-4-5-20251001"
		 */
		public Builder model(String model) {
			this.model = model;
			return this;
		}

		/**
		 * Sets a custom system prompt that replaces the default.
		 */
		public Builder systemPrompt(String systemPrompt) {
			this.systemPrompt = systemPrompt;
			return this;
		}

		/**
		 * Sets text to append to the default system prompt.
		 */
		public Builder appendSystemPrompt(String appendSystemPrompt) {
			this.appendSystemPrompt = appendSystemPrompt;
			return this;
		}

		/**
		 * Sets the timeout for the query. Default is 2 minutes.
		 */
		public Builder timeout(Duration timeout) {
			this.timeout = timeout;
			return this;
		}

		/**
		 * Sets the list of allowed tools. If empty, all tools are allowed.
		 */
		public Builder allowedTools(List<String> allowedTools) {
			this.allowedTools = allowedTools != null ? List.copyOf(allowedTools) : List.of();
			return this;
		}

		/**
		 * Sets the list of disallowed tools.
		 */
		public Builder disallowedTools(List<String> disallowedTools) {
			this.disallowedTools = disallowedTools != null ? List.copyOf(disallowedTools) : List.of();
			return this;
		}

		/**
		 * Sets the maximum number of agentic turns.
		 */
		public Builder maxTurns(Integer maxTurns) {
			this.maxTurns = maxTurns;
			return this;
		}

		/**
		 * Sets the maximum budget in USD.
		 */
		public Builder maxBudgetUsd(Double maxBudgetUsd) {
			this.maxBudgetUsd = maxBudgetUsd;
			return this;
		}

		/**
		 * Sets the working directory for the query.
		 */
		public Builder workingDirectory(Path workingDirectory) {
			this.workingDirectory = workingDirectory;
			return this;
		}

		public QueryOptions build() {
			return new QueryOptions(model, systemPrompt, appendSystemPrompt, timeout, allowedTools, disallowedTools,
					maxTurns, maxBudgetUsd, workingDirectory);
		}

	}

}
