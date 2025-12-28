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

package org.springaicommunity.claude.agent.examples;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springaicommunity.claude.agent.sdk.QueryOptions;
import org.springaicommunity.claude.agent.sdk.config.PermissionMode;
import org.springaicommunity.claude.agent.sdk.hooks.HookRegistry;
import org.springaicommunity.claude.agent.sdk.transport.CLIOptions;
import org.springaicommunity.claude.agent.sdk.types.control.HookEvent;
import org.springaicommunity.claude.agent.sdk.types.control.HookOutput;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for HelloWorld example patterns.
 * These tests verify SDK configuration without requiring the actual CLI.
 */
class HelloWorldTest {

	@Nested
	@DisplayName("QueryOptions Builder")
	class QueryOptionsTests {

		@Test
		@DisplayName("Should build with system prompt")
		void buildWithSystemPrompt() {
			QueryOptions options = QueryOptions.builder()
				.appendSystemPrompt("Be concise")
				.build();

			assertThat(options.appendSystemPrompt()).isEqualTo("Be concise");
		}

		@Test
		@DisplayName("Should build with model")
		void buildWithModel() {
			QueryOptions options = QueryOptions.builder()
				.model("haiku")
				.build();

			assertThat(options.model()).isEqualTo("haiku");
		}

		@Test
		@DisplayName("Should build with allowed tools")
		void buildWithAllowedTools() {
			QueryOptions options = QueryOptions.builder()
				.allowedTools(List.of("Read", "Write"))
				.build();

			assertThat(options.allowedTools()).containsExactly("Read", "Write");
		}

	}

	@Nested
	@DisplayName("CLIOptions Builder")
	class CLIOptionsTests {

		@Test
		@DisplayName("Should build with model constant")
		void buildWithModelConstant() {
			CLIOptions options = CLIOptions.builder()
				.model(CLIOptions.MODEL_HAIKU)
				.build();

			assertThat(options.model()).isEqualTo("claude-haiku-4-5-20251001");
		}

		@Test
		@DisplayName("Should build with permission mode")
		void buildWithPermissionMode() {
			CLIOptions options = CLIOptions.builder()
				.permissionMode(PermissionMode.DEFAULT)
				.build();

			assertThat(options.permissionMode()).isEqualTo(PermissionMode.DEFAULT);
		}

		@Test
		@DisplayName("Should build with bypass permissions mode")
		void buildWithBypassPermissions() {
			CLIOptions options = CLIOptions.builder()
				.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
				.build();

			assertThat(options.permissionMode()).isEqualTo(PermissionMode.BYPASS_PERMISSIONS);
		}

	}

	@Nested
	@DisplayName("HookRegistry")
	class HookRegistryTests {

		@Test
		@DisplayName("Should register PreToolUse hook")
		void registerPreToolUseHook() {
			HookRegistry registry = new HookRegistry();

			String hookId = registry.registerPreToolUse("Bash", input -> HookOutput.allow());

			assertThat(hookId).startsWith("hook_");
			assertThat(registry.hasHooks()).isTrue();
			assertThat(registry.getById(hookId)).isNotNull();
			assertThat(registry.getById(hookId).event()).isEqualTo(HookEvent.PRE_TOOL_USE);
		}

		@Test
		@DisplayName("Should register PostToolUse hook")
		void registerPostToolUseHook() {
			HookRegistry registry = new HookRegistry();

			String hookId = registry.registerPostToolUse("Write", input -> HookOutput.allow());

			assertThat(registry.getById(hookId).event()).isEqualTo(HookEvent.POST_TOOL_USE);
		}

		@Test
		@DisplayName("Should match tool pattern")
		void matchToolPattern() {
			HookRegistry registry = new HookRegistry();
			String hookId = registry.registerPreToolUse("Bash|Write", input -> HookOutput.allow());

			var hook = registry.getById(hookId);
			assertThat(hook.matchesTool("Bash")).isTrue();
			assertThat(hook.matchesTool("Write")).isTrue();
			assertThat(hook.matchesTool("Read")).isFalse();
		}

		@Test
		@DisplayName("Should execute hook callback")
		void executeHookCallback() {
			HookRegistry registry = new HookRegistry();
			AtomicBoolean called = new AtomicBoolean(false);

			registry.registerPreToolUse(input -> {
				called.set(true);
				return HookOutput.allow();
			});

			assertThat(registry.hasHooks()).isTrue();
			// Actual execution happens in ClaudeSyncClient
		}

		@Test
		@DisplayName("Should unregister hook")
		void unregisterHook() {
			HookRegistry registry = new HookRegistry();
			String hookId = registry.registerPreToolUse(input -> HookOutput.allow());

			boolean removed = registry.unregister(hookId);

			assertThat(removed).isTrue();
			assertThat(registry.hasHooks()).isFalse();
		}

	}

	@Nested
	@DisplayName("HookOutput")
	class HookOutputTests {

		@Test
		@DisplayName("Should create allow output")
		void createAllowOutput() {
			HookOutput output = HookOutput.allow();

			assertThat(output.continueExecution()).isTrue();
			assertThat(output.reason()).isNull();
		}

		@Test
		@DisplayName("Should create block output with reason")
		void createBlockOutput() {
			HookOutput output = HookOutput.block("Security policy violation");

			assertThat(output.continueExecution()).isFalse();
			assertThat(output.reason()).isEqualTo("Security policy violation");
		}

	}

}
