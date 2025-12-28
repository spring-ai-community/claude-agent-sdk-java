package org.springaicommunity.claude.agent.examples.email.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.claude.agent.sdk.ClaudeAsyncClient;
import org.springaicommunity.claude.agent.sdk.ClaudeClient;
import org.springaicommunity.claude.agent.sdk.config.PermissionMode;
import org.springaicommunity.claude.agent.sdk.types.AssistantMessage;
import org.springaicommunity.claude.agent.sdk.types.ToolUseBlock;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service for interacting with Claude via the Claude Agent SDK.
 */
@Service
public class ClaudeService {

	private static final Logger log = LoggerFactory.getLogger(ClaudeService.class);

	private static final String SYSTEM_PROMPT = loadSystemPrompt();

	/**
	 * Streams text responses from Claude for the given prompt.
	 */
	public Flux<String> streamText(String prompt) {
		log.info("========================================");
		log.info("STARTING CLAUDE QUERY");
		log.info("Prompt: {}", truncate(prompt, 200));
		log.info("========================================");

		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(Path.of(System.getProperty("user.dir")))
			.systemPrompt(SYSTEM_PROMPT)
			.timeout(Duration.ofMinutes(10))
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.build();

		return client.queryAndReceive(prompt)
			.doOnSubscribe(s -> log.info("[STREAM] Subscribed to ClaudeAsyncClient"))
			.doOnNext(msg -> log.debug("[STREAM] Message: {}", msg.getClass().getSimpleName()))
			.filter(msg -> msg instanceof AssistantMessage)
			.flatMap(msg -> {
				AssistantMessage assistant = (AssistantMessage) msg;

				if (assistant.hasToolUse()) {
					StringBuilder status = new StringBuilder();
					for (ToolUseBlock tool : assistant.getToolUses()) {
						log.info("[TOOL USE] {}", tool.name());
						status.append("\n\n*Using tool: ").append(tool.name()).append("...*\n\n");
					}
					return assistant.getTextContent()
						.map(text -> Mono.just(status.toString() + text))
						.orElse(Mono.just(status.toString()));
				}

				return assistant.getTextContent()
					.map(Mono::just)
					.orElse(Mono.empty());
			})
			.doOnComplete(() -> log.info("[STREAM] Query COMPLETED"))
			.doOnError(error -> log.error("[STREAM] Query ERROR: {}", error.getMessage(), error))
			.doFinally(signal -> client.close().subscribe());
	}

	/**
	 * Gets complete text response (non-streaming).
	 */
	public Mono<String> getText(String prompt) {
		return streamText(prompt)
			.reduce(new StringBuilder(), (sb, chunk) -> sb.append(chunk))
			.map(StringBuilder::toString);
	}

	private static String loadSystemPrompt() {
		try (InputStream is = ClaudeService.class.getResourceAsStream("/prompts/email-system-prompt.txt")) {
			if (is == null) {
				log.warn("System prompt file not found, using default");
				return getDefaultSystemPrompt();
			}
			return new String(is.readAllBytes(), StandardCharsets.UTF_8);
		}
		catch (IOException e) {
			log.error("Failed to load system prompt", e);
			return getDefaultSystemPrompt();
		}
	}

	private static String getDefaultSystemPrompt() {
		return """
			You are an AI email assistant that helps users manage their inbox.

			You can help with:
			- Reading and summarizing emails
			- Searching for specific emails
			- Drafting replies
			- Organizing emails

			Be concise and helpful.
			""";
	}

	private static String truncate(String text, int maxLength) {
		if (text == null || text.length() <= maxLength) {
			return text;
		}
		return text.substring(0, maxLength) + "...";
	}

}
