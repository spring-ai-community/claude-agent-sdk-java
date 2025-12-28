package org.springaicommunity.claude.agent.examples.excel.service;

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
import org.springaicommunity.claude.agent.sdk.types.Message;
import org.springaicommunity.claude.agent.sdk.types.ToolUseBlock;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service for interacting with Claude via the Claude Agent SDK.
 *
 * <p>Uses ClaudeAsyncClient to provide streaming text responses suitable for
 * Vaadin UI integration with proper thread-safety patterns.
 */
@Service
public class ClaudeService {

	private static final Logger log = LoggerFactory.getLogger(ClaudeService.class);

	private static final String SYSTEM_PROMPT = loadSystemPrompt();

	/**
	 * Streams text responses from Claude for the given prompt.
	 *
	 * <p>This method returns a Flux that emits text chunks as they arrive,
	 * suitable for real-time streaming to Vaadin UI components.
	 *
	 * @param prompt the user's prompt
	 * @return Flux of text chunks
	 */
	public Flux<String> streamText(String prompt) {
		return streamText(prompt, null);
	}

	/**
	 * Streams text responses from Claude with a custom working directory.
	 *
	 * @param prompt the user's prompt
	 * @param workingDirectory optional working directory for file operations
	 * @return Flux of text chunks
	 */
	public Flux<String> streamText(String prompt, Path workingDirectory) {
		log.info("========================================");
		log.info("STARTING CLAUDE QUERY");
		log.info("Prompt: {}", truncate(prompt, 200));
		log.info("Timeout: 10 minutes");
		log.info("========================================");

		Path effectiveWorkDir = workingDirectory != null ? workingDirectory : Path.of(System.getProperty("user.dir"));
		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(effectiveWorkDir)
			.systemPrompt(SYSTEM_PROMPT)
			.timeout(Duration.ofMinutes(10))
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.build();

		return client.queryAndReceive(prompt)
			.doOnSubscribe(s -> log.info("[STREAM] Subscribed to ClaudeAsyncClient"))
			.doOnNext(msg -> log.info("[STREAM] Message received: type={}", msg.getClass().getSimpleName()))
			.filter(msg -> msg instanceof AssistantMessage)
			.doOnNext(msg -> log.info("[STREAM] AssistantMessage passed filter"))
			.flatMap(msg -> {
				AssistantMessage assistant = (AssistantMessage) msg;
				log.info("[ASSISTANT] Content blocks: {}", assistant.content().size());

				// Check for tool use and emit status message
				if (assistant.hasToolUse()) {
					StringBuilder status = new StringBuilder();
					for (ToolUseBlock tool : assistant.getToolUses()) {
						String toolName = tool.name();
						log.info("[TOOL USE] Tool: {}", toolName);
						status.append("\n\n*Using tool: ").append(toolName).append("...*\n\n");
					}
					// Return tool status followed by any text content
					return assistant.getTextContent()
						.map(text -> {
							log.info("[ASSISTANT] Text content: {} chars", text.length());
							return Mono.just(status.toString() + text);
						})
						.orElse(Mono.just(status.toString()));
				}

				// Just text content
				return assistant.getTextContent()
					.map(text -> {
						log.info("[ASSISTANT] Text only: {} chars", text.length());
						return Mono.just(text);
					})
					.orElse(Mono.empty());
			})
			.doOnNext(text -> log.info("[OUTPUT] Emitting chunk: {} chars", text.length()))
			.doOnComplete(() -> log.info("[STREAM] Query COMPLETED successfully"))
			.doOnError(error -> log.error("[STREAM] Query ERROR: {}", error.getMessage(), error))
			.doFinally(signal -> {
				log.info("[STREAM] Final signal: {}", signal);
				client.close().subscribe();
			});
	}

	/**
	 * Gets a complete text response from Claude (non-streaming).
	 *
	 * @param prompt the user's prompt
	 * @return Mono containing the complete response text
	 */
	public Mono<String> getText(String prompt) {
		return streamText(prompt)
			.reduce(new StringBuilder(), StringBuilder::append)
			.map(StringBuilder::toString);
	}

	/**
	 * Streams all messages (including tool use) from Claude.
	 *
	 * <p>Use this method when you need access to the full message stream
	 * including tool use events, thinking blocks, etc.
	 *
	 * @param prompt the user's prompt
	 * @return Flux of all messages
	 */
	public Flux<Message> streamMessages(String prompt) {
		ClaudeAsyncClient client = ClaudeClient.async()
			.workingDirectory(Path.of(System.getProperty("user.dir")))
			.systemPrompt(SYSTEM_PROMPT)
			.timeout(Duration.ofMinutes(10))
			.permissionMode(PermissionMode.BYPASS_PERMISSIONS)
			.build();

		return client.queryAndReceive(prompt)
			.doFinally(signal -> client.close().subscribe());
	}

	/**
	 * Loads the system prompt from resources.
	 */
	private static String loadSystemPrompt() {
		try (InputStream is = ClaudeService.class.getResourceAsStream("/prompts/excel-system-prompt.txt")) {
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

	/**
	 * Default system prompt if file not found.
	 */
	private static String getDefaultSystemPrompt() {
		return """
			You are an AI assistant specialized in creating Excel spreadsheets.

			When the user describes a spreadsheet they need:
			1. Understand their requirements clearly
			2. Suggest an appropriate structure (columns, rows, formulas)
			3. Provide the data in a clear, structured format
			4. Explain any formulas or calculations you recommend

			Be concise but thorough. Focus on practical, usable spreadsheet designs.
			""";
	}

	/**
	 * Truncates a string for logging.
	 */
	private static String truncate(String text, int maxLength) {
		if (text == null || text.length() <= maxLength) {
			return text;
		}
		return text.substring(0, maxLength) + "...";
	}

}
