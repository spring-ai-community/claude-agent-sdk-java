package org.springaicommunity.claude.agent.examples.email.model;

import java.util.Date;

/**
 * Email record representing an email message.
 */
public record Email(
	String messageId,
	String subject,
	String from,
	String to,
	Date sentDate,
	String body
) {

	/**
	 * Returns a short preview of the email body.
	 */
	public String preview() {
		if (body == null || body.isEmpty()) {
			return "";
		}
		int maxLen = 100;
		if (body.length() <= maxLen) {
			return body;
		}
		return body.substring(0, maxLen) + "...";
	}

	/**
	 * Returns a formatted summary suitable for display.
	 */
	public String summary() {
		return String.format("From: %s\nSubject: %s\nDate: %s\n\n%s",
			from != null ? from : "Unknown",
			subject != null ? subject : "(no subject)",
			sentDate != null ? sentDate.toString() : "Unknown",
			preview());
	}

}
