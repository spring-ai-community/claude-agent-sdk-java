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

package org.springaicommunity.claude.agent.sdk.parsing;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springaicommunity.claude.agent.sdk.types.Message;
import org.springaicommunity.claude.agent.sdk.types.ResultMessage;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for MessageParser - verifies parsing of all message types including structured output.
 *
 * <p>IMPORTANT: These tests exist because the MessageParser must parse ALL fields from CLI JSON.
 * A previous bug occurred when structured_output field was in the record but parser didn't set it.
 * For every field in a Message record, there MUST be a corresponding test here.</p>
 */
class MessageParserTest {

	private MessageParser parser;

	@BeforeEach
	void setUp() {
		parser = new MessageParser();
	}

	@Nested
	@DisplayName("Result Message Parsing")
	class ResultMessageParsing {

		@Test
		@DisplayName("should parse result message with structured_output")
		void shouldParseResultWithStructuredOutput() throws Exception {
			String json = """
				{
					"type": "result",
					"subtype": "success",
					"is_error": false,
					"duration_ms": 1000,
					"duration_api_ms": 800,
					"num_turns": 2,
					"session_id": "test-session",
					"total_cost_usd": 0.01,
					"result": "",
					"structured_output": {
						"answer": 4,
						"explanation": "2 plus 2 equals 4"
					}
				}
				""";

			Message message = parser.parseMessage(json);

			assertThat(message).isInstanceOf(ResultMessage.class);
			ResultMessage result = (ResultMessage) message;

			assertThat(result.hasStructuredOutput()).isTrue();
			Map<String, Object> output = result.getStructuredOutputAsMap();
			assertThat(output).isNotNull();
			assertThat(output.get("answer")).isEqualTo(4);
			assertThat(output.get("explanation")).isEqualTo("2 plus 2 equals 4");
		}

		@Test
		@DisplayName("should parse result message with nested structured_output")
		void shouldParseResultWithNestedStructuredOutput() throws Exception {
			String json = """
				{
					"type": "result",
					"subtype": "success",
					"is_error": false,
					"duration_ms": 1000,
					"num_turns": 1,
					"session_id": "test-session",
					"total_cost_usd": 0.02,
					"structured_output": {
						"languages": [
							{"name": "Java", "year": 1995},
							{"name": "Python", "year": 1991}
						]
					}
				}
				""";

			Message message = parser.parseMessage(json);
			ResultMessage result = (ResultMessage) message;

			assertThat(result.hasStructuredOutput()).isTrue();
			Map<String, Object> output = result.getStructuredOutputAsMap();
			assertThat(output).containsKey("languages");

			@SuppressWarnings("unchecked")
			List<Map<String, Object>> languages = (List<Map<String, Object>>) output.get("languages");
			assertThat(languages).hasSize(2);
			assertThat(languages.get(0).get("name")).isEqualTo("Java");
			assertThat(languages.get(0).get("year")).isEqualTo(1995);
		}

		@Test
		@DisplayName("should parse result message without structured_output")
		void shouldParseResultWithoutStructuredOutput() throws Exception {
			String json = """
				{
					"type": "result",
					"subtype": "success",
					"is_error": false,
					"duration_ms": 500,
					"num_turns": 1,
					"session_id": "test-session",
					"total_cost_usd": 0.005,
					"result": "Some text result"
				}
				""";

			Message message = parser.parseMessage(json);
			ResultMessage result = (ResultMessage) message;

			assertThat(result.hasStructuredOutput()).isFalse();
			assertThat(result.getStructuredOutputAsMap()).isNull();
			assertThat(result.result()).isEqualTo("Some text result");
		}

		@Test
		@DisplayName("should parse result message with null structured_output")
		void shouldParseResultWithNullStructuredOutput() throws Exception {
			String json = """
				{
					"type": "result",
					"subtype": "success",
					"is_error": false,
					"duration_ms": 500,
					"num_turns": 1,
					"session_id": "test-session",
					"structured_output": null
				}
				""";

			Message message = parser.parseMessage(json);
			ResultMessage result = (ResultMessage) message;

			assertThat(result.hasStructuredOutput()).isFalse();
			assertThat(result.getStructuredOutputAsMap()).isNull();
		}
	}

}
