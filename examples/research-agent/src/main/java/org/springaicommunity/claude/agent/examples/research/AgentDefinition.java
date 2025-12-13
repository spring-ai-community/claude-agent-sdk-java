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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Defines a specialized subagent for use with the Task tool.
 *
 * <p>
 * An AgentDefinition specifies the capabilities and behavior of a subagent that can be
 * spawned by a parent agent using the Task tool. This mirrors the Python SDK's
 * AgentDefinition class.
 * </p>
 *
 * <p>
 * Example usage:
 * </p>
 *
 * <pre>{@code
 * AgentDefinition researcher = new AgentDefinition(
 *     "Use this agent to gather research information using web search",
 *     List.of("WebSearch", "Write"),
 *     "You are a research specialist...",
 *     "haiku"
 * );
 * }</pre>
 *
 * @param description When to use this agent (shown to parent agent for decision-making)
 * @param tools List of tools the subagent can use
 * @param prompt System prompt/instructions for the subagent
 * @param model Model to use (e.g., "haiku", "sonnet", "opus")
 */
public record AgentDefinition(String description, List<String> tools, String prompt, String model) {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	/**
	 * Creates an AgentDefinition with a default model (haiku).
	 * @param description When to use this agent
	 * @param tools List of allowed tools
	 * @param prompt System prompt for the agent
	 */
	public AgentDefinition(String description, List<String> tools, String prompt) {
		this(description, tools, prompt, "haiku");
	}

	/**
	 * Converts a map of agent definitions to JSON format for the CLI --agents parameter.
	 * @param agents map of agent name to definition
	 * @return JSON string for CLI
	 */
	public static String toJson(Map<String, AgentDefinition> agents) {
		Map<String, Map<String, Object>> jsonMap = new LinkedHashMap<>();
		for (var entry : agents.entrySet()) {
			Map<String, Object> agentJson = new LinkedHashMap<>();
			AgentDefinition def = entry.getValue();
			agentJson.put("description", def.description());
			agentJson.put("tools", def.tools());
			agentJson.put("prompt", def.prompt());
			agentJson.put("model", def.model());
			jsonMap.put(entry.getKey(), agentJson);
		}
		try {
			return MAPPER.writeValueAsString(jsonMap);
		}
		catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to serialize agents to JSON", e);
		}
	}

	/**
	 * Creates a builder for fluent AgentDefinition construction.
	 * @return new builder instance
	 */
	public static Builder builder() {
		return new Builder();
	}

	/**
	 * Builder for creating AgentDefinition instances.
	 */
	public static class Builder {

		private String description;

		private List<String> tools = List.of();

		private String prompt;

		private String model = "haiku";

		public Builder description(String description) {
			this.description = description;
			return this;
		}

		public Builder tools(List<String> tools) {
			this.tools = tools;
			return this;
		}

		public Builder tools(String... tools) {
			this.tools = List.of(tools);
			return this;
		}

		public Builder prompt(String prompt) {
			this.prompt = prompt;
			return this;
		}

		public Builder model(String model) {
			this.model = model;
			return this;
		}

		public AgentDefinition build() {
			if (description == null || description.isBlank()) {
				throw new IllegalArgumentException("description is required");
			}
			if (prompt == null || prompt.isBlank()) {
				throw new IllegalArgumentException("prompt is required");
			}
			return new AgentDefinition(description, tools, prompt, model);
		}

	}

}
