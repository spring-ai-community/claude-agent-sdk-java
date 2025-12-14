package org.springaicommunity.claude.agent.examples.email.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.claude.agent.examples.email.model.Email;
import org.springaicommunity.claude.agent.examples.email.service.ClaudeService;
import org.springaicommunity.claude.agent.examples.email.service.EmailSeeder;
import org.springaicommunity.claude.agent.examples.email.service.ImapService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Mono;

/**
 * REST controller for programmatic testing.
 *
 * <p>Non-streaming endpoints for easy curl testing.
 *
 * Usage:
 *   curl -X POST "http://localhost:8081/api/test/query" \
 *        -H "Content-Type: text/plain" \
 *        -d "Summarize my recent emails"
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

	private static final Logger log = LoggerFactory.getLogger(TestController.class);

	private final ClaudeService claudeService;

	private final ImapService imapService;

	private final EmailSeeder emailSeeder;

	public TestController(ClaudeService claudeService, ImapService imapService, EmailSeeder emailSeeder) {
		this.claudeService = claudeService;
		this.imapService = imapService;
		this.emailSeeder = emailSeeder;
	}

	/**
	 * Submit a query and get complete response (non-streaming).
	 */
	@PostMapping(value = "/query", produces = MediaType.TEXT_PLAIN_VALUE)
	public Mono<String> query(@RequestBody String prompt) {
		log.info("=== TEST QUERY ===");
		log.info("Prompt: {}", prompt);

		return claudeService.getText(prompt)
			.doOnSuccess(result -> log.info("Query completed: {} chars", result.length()))
			.doOnError(e -> log.error("Query error: {}", e.getMessage(), e));
	}

	/**
	 * List recent emails from IMAP server.
	 */
	@GetMapping("/emails")
	public List<Email> listEmails(@RequestParam(defaultValue = "10") int limit) {
		log.info("Fetching {} recent emails", limit);
		return imapService.fetchRecent(limit);
	}

	/**
	 * Get a specific email by message number.
	 */
	@GetMapping("/emails/{messageNumber}")
	public Email getEmail(@PathVariable int messageNumber) {
		log.info("Fetching email {}", messageNumber);
		return imapService.fetchEmail(messageNumber);
	}

	/**
	 * Search emails.
	 */
	@GetMapping("/emails/search")
	public List<Email> searchEmails(
			@RequestParam String q,
			@RequestParam(defaultValue = "10") int limit) {
		log.info("Searching emails: '{}' (limit {})", q, limit);
		return imapService.search(q, limit);
	}

	/**
	 * Get email count.
	 */
	@GetMapping("/emails/count")
	public int getEmailCount() {
		return imapService.getEmailCount();
	}

	/**
	 * Seed test emails to the mail server.
	 */
	@PostMapping("/seed")
	public String seedEmails() {
		log.info("Seeding test emails...");
		int count = emailSeeder.seedTestEmails();
		return "Seeded " + count + " test emails";
	}

	/**
	 * Health check.
	 */
	@GetMapping("/health")
	public String health() {
		return "OK - Email Agent Test API";
	}

}
