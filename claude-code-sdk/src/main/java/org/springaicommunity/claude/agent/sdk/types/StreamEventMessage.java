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

package org.springaicommunity.claude.agent.sdk.types;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

/**
 * Represents a {@code stream_event} message emitted by the Claude CLI when
 * {@code includePartialMessages} is enabled.
 *
 * <p>Stream events wrap intermediate Anthropic API streaming events such as
 * {@code message_start}, {@code content_block_delta}, and {@code message_stop}.
 * The outer envelope carries CLI-level metadata (session ID, UUID, TTFT), while
 * the nested {@code event} object holds the actual Anthropic streaming event
 * with its own {@code type} and payload.
 *
 * @see <a href="https://docs.anthropic.com/en/api/messages-streaming">Anthropic Streaming API</a>
 */
public record StreamEventMessage(

		@JsonProperty("event_type") String eventType,

		@JsonProperty("session_id") String sessionId,

		@JsonProperty("uuid") String uuid,

		@JsonProperty("parent_tool_use_id") String parentToolUseId,

		@JsonProperty("ttft_ms") Long ttftMs,

		@JsonProperty("event") Map<String, Object> event) implements Message {

	@Override
	public String getType() {
		return "stream_event";
	}

	@Override
	public String toString() {
		return String.format("[StreamEvent: %s session=%s]",
				eventType != null ? eventType : "unknown", sessionId);
	}

	public static StreamEventMessage of(String eventType, String sessionId, String uuid,
			String parentToolUseId, Long ttftMs, Map<String, Object> event) {
		return new StreamEventMessage(eventType, sessionId, uuid, parentToolUseId, ttftMs, event);
	}

}
