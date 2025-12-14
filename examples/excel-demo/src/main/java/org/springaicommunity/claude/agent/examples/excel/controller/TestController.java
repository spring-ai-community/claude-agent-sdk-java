package org.springaicommunity.claude.agent.examples.excel.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.claude.agent.examples.excel.service.ClaudeService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Mono;

/**
 * REST controller for programmatic testing of Claude queries.
 *
 * Usage:
 *   curl -X POST "http://localhost:8080/api/test/query" \
 *        -H "Content-Type: text/plain" \
 *        -d "Create a simple budget tracker"
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

	private static final Logger log = LoggerFactory.getLogger(TestController.class);

	private final ClaudeService claudeService;

	public TestController(ClaudeService claudeService) {
		this.claudeService = claudeService;
	}

	/**
	 * Submit a query and get complete response (non-streaming).
	 *
	 * @param prompt the question to ask Claude
	 * @return complete text response
	 */
	@PostMapping(value = "/query", produces = MediaType.TEXT_PLAIN_VALUE)
	public Mono<String> query(@RequestBody String prompt) {
		log.info("=== TEST QUERY RECEIVED ===");
		log.info("Prompt: {}", prompt);

		return claudeService.streamText(prompt)
			.doOnSubscribe(s -> log.info(">>> Stream subscribed"))
			.doOnNext(chunk -> log.info(">>> Chunk received: {} chars", chunk.length()))
			.reduce(new StringBuilder(), (sb, chunk) -> sb.append(chunk))
			.map(StringBuilder::toString)
			.doOnSuccess(result -> log.info(">>> Query completed: {} chars total", result.length()))
			.doOnError(e -> log.error(">>> Stream error: {}", e.getMessage(), e));
	}

	/**
	 * Simple health check.
	 */
	@GetMapping("/health")
	public String health() {
		return "OK - Excel Demo Test API";
	}
}
