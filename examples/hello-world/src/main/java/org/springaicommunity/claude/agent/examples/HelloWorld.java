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

import org.springaicommunity.claude.agent.sdk.Query;
import org.springaicommunity.claude.agent.sdk.QueryOptions;
import org.springaicommunity.claude.agent.sdk.types.QueryResult;

/**
 * Simple example demonstrating Claude Agent SDK usage.
 *
 * <p>
 * This example shows the simplest way to use the SDK - just one line of code!
 * </p>
 *
 * <p>
 * For multi-turn conversations, hooks, or MCP integration, see the session-example.
 * </p>
 */
public class HelloWorld {

	public static void main(String[] args) {
		System.out.println("Claude Agent SDK - Hello World Example");
		System.out.println("=" .repeat(50));
		System.out.println();

		try {
			// ============================================================
			// SIMPLE API - One line!
			// ============================================================
			System.out.println("1. Simple Query (one line):");
			System.out.println("-".repeat(50));

			String answer = Query.text("What is 2+2? Reply with just the number.");
			System.out.println("Answer: " + answer);
			System.out.println();

			// ============================================================
			// WITH OPTIONS
			// ============================================================
			System.out.println("2. Query with Options:");
			System.out.println("-".repeat(50));

			String funFact = Query.text("Tell me a fun fact about Java programming.",
					QueryOptions.builder().appendSystemPrompt("Be concise, one sentence max.").build());
			System.out.println("Fun fact: " + funFact);
			System.out.println();

			// ============================================================
			// FULL RESULT WITH METADATA
			// ============================================================
			System.out.println("3. Full Result with Metadata:");
			System.out.println("-".repeat(50));

			QueryResult result = Query.execute("Write a haiku about coding.");
			result.text().ifPresent(text -> System.out.println("Haiku:\n" + text));
			System.out.println();
			System.out.println("Metadata:");
			System.out.println("  - Model: " + result.metadata().model());
			System.out.println("  - Cost: $" + result.metadata().cost().calculateTotal());
			System.out.println("  - Duration: " + result.metadata().getDuration().toMillis() + "ms");
			System.out.println("  - Turns: " + result.metadata().numTurns());

		}
		catch (Exception e) {
			System.err.println("Error: " + e.getMessage());
			e.printStackTrace();
		}
	}

}
