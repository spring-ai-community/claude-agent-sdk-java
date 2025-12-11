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

package org.springaicommunity.claudecode.examples;

import org.springaicommunity.claudecode.sdk.session.ClaudeSession;
import org.springaicommunity.claudecode.sdk.session.DefaultClaudeSession;
import org.springaicommunity.claudecode.sdk.parsing.ParsedMessage;
import org.springaicommunity.claudecode.sdk.types.AssistantMessage;
import org.springaicommunity.claudecode.sdk.types.ContentBlock;
import org.springaicommunity.claudecode.sdk.types.Message;
import org.springaicommunity.claudecode.sdk.types.ResultMessage;
import org.springaicommunity.claudecode.sdk.types.TextBlock;

import java.nio.file.Path;
import java.util.Iterator;

/**
 * Simple example demonstrating Claude Code SDK usage.
 *
 * <p>This example shows how to:
 * <ul>
 *   <li>Create a ClaudeSession with a working directory</li>
 *   <li>Connect to Claude CLI with an initial prompt</li>
 *   <li>Receive and process streaming responses</li>
 * </ul>
 */
public class HelloWorld {

	public static void main(String[] args) {
		// Use current directory as working directory
		Path workingDir = Path.of(System.getProperty("user.dir"));

		System.out.println("Claude Code SDK - Hello World Example");
		System.out.println("Working directory: " + workingDir);
		System.out.println();

		try (ClaudeSession session = DefaultClaudeSession.builder()
			.workingDirectory(workingDir)
			.build()) {

			// Connect with initial prompt
			session.connect("Say hello and tell me a fun fact about Java programming.");

			// Receive response messages
			System.out.println("Response from Claude:");
			System.out.println("─".repeat(50));

			Iterator<ParsedMessage> messages = session.receiveResponse();
			while (messages.hasNext()) {
				ParsedMessage parsed = messages.next();

				if (parsed.isRegularMessage()) {
					Message msg = parsed.asMessage();

					if (msg instanceof AssistantMessage assistant) {
						// Print assistant text content
						if (assistant.content() != null) {
							for (ContentBlock block : assistant.content()) {
								if (block instanceof TextBlock text) {
									System.out.print(text.text());
								}
							}
						}
					}
					else if (msg instanceof ResultMessage result) {
						System.out.println();
						System.out.println("─".repeat(50));
						System.out.println("Session completed. Cost: $" + result.totalCostUsd());
					}
				}
			}
		}
		catch (Exception e) {
			System.err.println("Error: " + e.getMessage());
			e.printStackTrace();
		}
	}

}
