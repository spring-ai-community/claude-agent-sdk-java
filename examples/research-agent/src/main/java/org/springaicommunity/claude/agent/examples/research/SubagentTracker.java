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

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.claude.agent.sdk.hooks.HookRegistry;
import org.springaicommunity.claude.agent.sdk.types.control.HookInput;
import org.springaicommunity.claude.agent.sdk.types.control.HookOutput;

import java.io.BufferedWriter;
import java.io.Closeable;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Tracks all tool calls made by subagents using hooks and message stream parsing.
 *
 * <p>
 * This tracker:
 * </p>
 * <ul>
 * <li>Monitors tool calls via PreToolUse and PostToolUse hooks</li>
 * <li>Detects subagent spawns via Task tool calls</li>
 * <li>Associates tool calls with their originating subagent</li>
 * <li>Logs tool usage to console and JSONL files</li>
 * </ul>
 *
 * <p>
 * Example usage:
 * </p>
 *
 * <pre>{@code
 * Path sessionDir = Path.of("logs/session_20251213");
 * SubagentTracker tracker = new SubagentTracker(sessionDir);
 *
 * // Register hooks
 * HookRegistry registry = tracker.createHookRegistry();
 *
 * // Use registry with ClaudeSyncClient...
 *
 * // When done
 * tracker.close();
 * }</pre>
 */
public class SubagentTracker implements Closeable {

	private static final Logger logger = LoggerFactory.getLogger(SubagentTracker.class);

	private static final ObjectMapper objectMapper = new ObjectMapper();

	private final Path sessionDir;

	private final BufferedWriter toolLogWriter;

	// Map: parent_tool_use_id -> SubagentSession
	private final Map<String, SubagentSession> sessions = new ConcurrentHashMap<>();

	// Map: tool_use_id -> ToolCallRecord (for lookup in post hook)
	private final Map<String, ToolCallRecord> toolCallRecords = new ConcurrentHashMap<>();

	// Current execution context
	private volatile String currentParentId;

	// Counter for each subagent type to create unique IDs
	private final Map<String, AtomicInteger> subagentCounters = new ConcurrentHashMap<>();

	/**
	 * Creates a tracker with logging to the specified session directory.
	 * @param sessionDir directory for log files
	 * @throws IOException if log files cannot be created
	 */
	public SubagentTracker(Path sessionDir) throws IOException {
		this.sessionDir = sessionDir;
		Files.createDirectories(sessionDir);
		this.toolLogWriter = Files.newBufferedWriter(sessionDir.resolve("tool_calls.jsonl"));
		logger.info("SubagentTracker initialized, logs at: {}", sessionDir);
	}

	/**
	 * Creates a HookRegistry with PreToolUse and PostToolUse hooks configured.
	 * @return configured hook registry
	 */
	public HookRegistry createHookRegistry() {
		HookRegistry registry = new HookRegistry();

		// Register PreToolUse hook for all tools
		registry.registerPreToolUse(this::handlePreToolUse);

		// Register PostToolUse hook for all tools
		registry.registerPostToolUse(this::handlePostToolUse);

		return registry;
	}

	/**
	 * Sets the current execution context (parent tool use ID).
	 * @param parentToolUseId the parent tool use ID from message stream
	 */
	public void setCurrentContext(String parentToolUseId) {
		this.currentParentId = parentToolUseId;
	}

	/**
	 * Registers a new subagent spawn.
	 * @param toolUseId the Task tool use ID
	 * @param subagentType type of subagent (e.g., "researcher")
	 * @param description brief task description
	 * @param prompt the full prompt
	 * @return generated subagent ID (e.g., "RESEARCHER-1")
	 */
	public String registerSubagentSpawn(String toolUseId, String subagentType, String description, String prompt) {
		AtomicInteger counter = subagentCounters.computeIfAbsent(subagentType, k -> new AtomicInteger(0));
		int num = counter.incrementAndGet();
		String subagentId = subagentType.toUpperCase() + "-" + num;

		SubagentSession session = new SubagentSession(subagentType, toolUseId, Instant.now().toString(), description,
				truncate(prompt, 200), subagentId);

		sessions.put(toolUseId, session);

		System.out.println("=".repeat(60));
		System.out.println("SUBAGENT SPAWNED: " + subagentId);
		System.out.println("=".repeat(60));
		System.out.println("Task: " + description);
		System.out.println("=".repeat(60));

		return subagentId;
	}

	/**
	 * Gets the subagent session for a parent tool use ID.
	 * @param parentToolUseId the parent tool use ID
	 * @return optional containing the session if found
	 */
	public Optional<SubagentSession> getSession(String parentToolUseId) {
		return Optional.ofNullable(sessions.get(parentToolUseId));
	}

	/**
	 * Handles PreToolUse hook - captures tool calls before execution.
	 */
	private HookOutput handlePreToolUse(HookInput input) {
		if (!(input instanceof HookInput.PreToolUseInput preToolUse)) {
			return HookOutput.allow();
		}

		String toolName = preToolUse.toolName();
		Map<String, Object> toolInput = preToolUse.toolInput();
		String toolUseId = preToolUse.toolUseId();
		String timestamp = Instant.now().toString();

		boolean isSubagent = currentParentId != null && sessions.containsKey(currentParentId);

		if (isSubagent) {
			SubagentSession session = sessions.get(currentParentId);

			// Create and store record
			ToolCallRecord record = new ToolCallRecord(timestamp, toolName, toolInput, toolUseId,
					session.subagentType(), currentParentId);
			session.addToolCall(record);
			toolCallRecords.put(toolUseId, record);

			// Log
			logToolUse(session.subagentId(), toolName, toolInput);
			logToJsonl("tool_call_start", toolUseId, session.subagentId(), session.subagentType(), toolName, toolInput,
					currentParentId, null);
		}
		else if (!"Task".equals(toolName)) {
			// Main agent tool call (skip Task since it's handled by spawn)
			logToolUse("MAIN AGENT", toolName, toolInput);
			logToJsonl("tool_call_start", toolUseId, "MAIN_AGENT", "lead", toolName, toolInput, null, null);
		}

		return HookOutput.allow();
	}

	/**
	 * Handles PostToolUse hook - captures tool results after execution.
	 */
	private HookOutput handlePostToolUse(HookInput input) {
		if (!(input instanceof HookInput.PostToolUseInput postToolUse)) {
			return HookOutput.allow();
		}

		String toolUseId = postToolUse.toolUseId();
		ToolCallRecord record = toolCallRecords.get(toolUseId);

		if (record == null) {
			return HookOutput.allow();
		}

		// Update record with output
		Object toolResponse = postToolUse.toolResponse();
		record.setToolOutput(toolResponse);

		// Check for errors
		String error = null;
		if (toolResponse instanceof Map<?, ?> responseMap) {
			Object errorObj = responseMap.get("error");
			if (errorObj != null) {
				error = errorObj.toString();
				record.setError(error);
				SubagentSession session = sessions.get(record.parentToolUseId());
				if (session != null) {
					logger.warn("[{}] Tool {} error: {}", session.subagentId(), record.toolName(), error);
				}
			}
		}

		// Get agent info for logging
		SubagentSession session = sessions.get(record.parentToolUseId());
		String agentId = session != null ? session.subagentId() : "MAIN_AGENT";
		String agentType = session != null ? session.subagentType() : "lead";

		logToJsonl("tool_call_complete", toolUseId, agentId, agentType, record.toolName(), null,
				record.parentToolUseId(), error);

		return HookOutput.allow();
	}

	private void logToolUse(String agentLabel, String toolName, Map<String, Object> toolInput) {
		String message = String.format("[%s] -> %s", agentLabel, toolName);
		System.out.println(message);
		logger.info(message);

		// Log input details
		String detail = formatToolInput(toolInput);
		if (!detail.isEmpty()) {
			logger.debug("    Input: {}", detail);
		}
	}

	private String formatToolInput(Map<String, Object> toolInput) {
		if (toolInput == null || toolInput.isEmpty()) {
			return "";
		}

		// WebSearch: show query
		if (toolInput.containsKey("query")) {
			String query = String.valueOf(toolInput.get("query"));
			return "query='" + truncate(query, 100) + "'";
		}

		// Write: show file path
		if (toolInput.containsKey("file_path") && toolInput.containsKey("content")) {
			String content = String.valueOf(toolInput.get("content"));
			return "file='" + toolInput.get("file_path") + "' (" + content.length() + " chars)";
		}

		// Read/Glob: show path or pattern
		if (toolInput.containsKey("file_path")) {
			return "path='" + toolInput.get("file_path") + "'";
		}
		if (toolInput.containsKey("pattern")) {
			return "pattern='" + toolInput.get("pattern") + "'";
		}

		// Task: show subagent spawn
		if (toolInput.containsKey("subagent_type")) {
			return "spawn=" + toolInput.get("subagent_type") + " (" + toolInput.get("description") + ")";
		}

		return truncate(toolInput.toString(), 100);
	}

	private void logToJsonl(String event, String toolUseId, String agentId, String agentType, String toolName,
			Map<String, Object> toolInput, String parentToolUseId, String error) {
		try {
			Map<String, Object> entry = new LinkedHashMap<>();
			entry.put("event", event);
			entry.put("timestamp", Instant.now().toString());
			entry.put("tool_use_id", toolUseId);
			entry.put("agent_id", agentId);
			entry.put("agent_type", agentType);
			entry.put("tool_name", toolName);
			if (toolInput != null) {
				entry.put("tool_input", toolInput);
			}
			if (parentToolUseId != null) {
				entry.put("parent_tool_use_id", parentToolUseId);
			}
			if (error != null) {
				entry.put("error", error);
			}

			toolLogWriter.write(objectMapper.writeValueAsString(entry));
			toolLogWriter.newLine();
			toolLogWriter.flush();
		}
		catch (IOException e) {
			logger.error("Failed to write to tool log", e);
		}
	}

	private String truncate(String s, int maxLen) {
		if (s == null) {
			return "";
		}
		return s.length() <= maxLen ? s : s.substring(0, maxLen) + "...";
	}

	/**
	 * Gets the session directory path.
	 * @return session directory
	 */
	public Path getSessionDir() {
		return sessionDir;
	}

	@Override
	public void close() {
		try {
			toolLogWriter.close();
		}
		catch (IOException e) {
			logger.error("Failed to close tool log writer", e);
		}
	}

	/**
	 * Creates a session directory with timestamp.
	 * @param baseDir base directory for sessions
	 * @return path to the new session directory
	 */
	public static Path createSessionDir(Path baseDir) {
		String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
		return baseDir.resolve("session_" + timestamp);
	}

	/**
	 * Record of a subagent execution session.
	 */
	public static class SubagentSession {

		private final String subagentType;

		private final String parentToolUseId;

		private final String spawnedAt;

		private final String description;

		private final String promptPreview;

		private final String subagentId;

		private final java.util.List<ToolCallRecord> toolCalls = new java.util.ArrayList<>();

		public SubagentSession(String subagentType, String parentToolUseId, String spawnedAt, String description,
				String promptPreview, String subagentId) {
			this.subagentType = subagentType;
			this.parentToolUseId = parentToolUseId;
			this.spawnedAt = spawnedAt;
			this.description = description;
			this.promptPreview = promptPreview;
			this.subagentId = subagentId;
		}

		public String subagentType() {
			return subagentType;
		}

		public String parentToolUseId() {
			return parentToolUseId;
		}

		public String subagentId() {
			return subagentId;
		}

		public void addToolCall(ToolCallRecord record) {
			toolCalls.add(record);
		}

	}

	/**
	 * Record of a single tool call.
	 */
	public static class ToolCallRecord {

		private final String timestamp;

		private final String toolName;

		private final Map<String, Object> toolInput;

		private final String toolUseId;

		private final String subagentType;

		private final String parentToolUseId;

		private Object toolOutput;

		private String error;

		public ToolCallRecord(String timestamp, String toolName, Map<String, Object> toolInput, String toolUseId,
				String subagentType, String parentToolUseId) {
			this.timestamp = timestamp;
			this.toolName = toolName;
			this.toolInput = toolInput;
			this.toolUseId = toolUseId;
			this.subagentType = subagentType;
			this.parentToolUseId = parentToolUseId;
		}

		public String toolName() {
			return toolName;
		}

		public String parentToolUseId() {
			return parentToolUseId;
		}

		public void setToolOutput(Object output) {
			this.toolOutput = output;
		}

		public void setError(String error) {
			this.error = error;
		}

	}

}
