package org.springaicommunity.claude.agent.examples.email.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.Store;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.claude.agent.examples.email.model.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service for IMAP email operations.
 *
 * <p>Connects directly to IMAP server - no local caching.
 */
@Service
public class ImapService {

	private static final Logger log = LoggerFactory.getLogger(ImapService.class);

	@Value("${email.imap.host:localhost}")
	private String host;

	@Value("${email.imap.port:3143}")
	private int port;

	@Value("${email.imap.user:user}")
	private String user;

	@Value("${email.imap.password:password}")
	private String password;

	@Value("${email.imap.ssl:false}")
	private boolean useSsl;

	/**
	 * Fetches recent emails from the inbox.
	 *
	 * @param count maximum number of emails to fetch
	 * @return list of emails
	 */
	public List<Email> fetchRecent(int count) {
		List<Email> emails = new ArrayList<>();
		Properties props = new Properties();
		props.put("mail.imap.host", host);
		props.put("mail.imap.port", String.valueOf(port));
		props.put("mail.imap.ssl.enable", String.valueOf(useSsl));

		try {
			Session session = Session.getInstance(props);
			Store store = session.getStore("imap");
			store.connect(host, port, user, password);

			Folder inbox = store.getFolder("INBOX");
			inbox.open(Folder.READ_ONLY);

			int messageCount = inbox.getMessageCount();
			int start = Math.max(1, messageCount - count + 1);

			log.info("Fetching emails {} to {} from inbox", start, messageCount);

			for (int i = messageCount; i >= start && i >= 1; i--) {
				Message message = inbox.getMessage(i);
				emails.add(convertToEmail(message, i));
			}

			inbox.close(false);
			store.close();
		}
		catch (MessagingException e) {
			log.error("Failed to fetch emails", e);
		}

		return emails;
	}

	/**
	 * Fetches a specific email by message number.
	 */
	public Email fetchEmail(int messageNumber) {
		Properties props = new Properties();
		props.put("mail.imap.host", host);
		props.put("mail.imap.port", String.valueOf(port));
		props.put("mail.imap.ssl.enable", String.valueOf(useSsl));

		try {
			Session session = Session.getInstance(props);
			Store store = session.getStore("imap");
			store.connect(host, port, user, password);

			Folder inbox = store.getFolder("INBOX");
			inbox.open(Folder.READ_ONLY);

			if (messageNumber < 1 || messageNumber > inbox.getMessageCount()) {
				log.warn("Invalid message number: {}", messageNumber);
				return null;
			}

			Message message = inbox.getMessage(messageNumber);
			Email email = convertToEmail(message, messageNumber);

			inbox.close(false);
			store.close();

			return email;
		}
		catch (MessagingException e) {
			log.error("Failed to fetch email {}", messageNumber, e);
			return null;
		}
	}

	/**
	 * Searches emails by subject or sender.
	 */
	public List<Email> search(String query, int limit) {
		List<Email> results = new ArrayList<>();
		String lowerQuery = query.toLowerCase();

		// Simple search - fetch all and filter
		List<Email> allEmails = fetchRecent(50);
		for (Email email : allEmails) {
			if (results.size() >= limit) break;

			boolean matches = (email.subject() != null && email.subject().toLowerCase().contains(lowerQuery))
				|| (email.from() != null && email.from().toLowerCase().contains(lowerQuery))
				|| (email.body() != null && email.body().toLowerCase().contains(lowerQuery));

			if (matches) {
				results.add(email);
			}
		}

		return results;
	}

	/**
	 * Gets the total email count in inbox.
	 */
	public int getEmailCount() {
		Properties props = new Properties();
		props.put("mail.imap.host", host);
		props.put("mail.imap.port", String.valueOf(port));

		try {
			Session session = Session.getInstance(props);
			Store store = session.getStore("imap");
			store.connect(host, port, user, password);

			Folder inbox = store.getFolder("INBOX");
			inbox.open(Folder.READ_ONLY);
			int count = inbox.getMessageCount();
			inbox.close(false);
			store.close();

			return count;
		}
		catch (MessagingException e) {
			log.error("Failed to get email count", e);
			return 0;
		}
	}

	private Email convertToEmail(Message message, int messageNumber) throws MessagingException {
		String subject = message.getSubject();
		String from = "";
		String to = "";
		String body = "";

		if (message.getFrom() != null && message.getFrom().length > 0) {
			InternetAddress addr = (InternetAddress) message.getFrom()[0];
			from = addr.getPersonal() != null
				? addr.getPersonal() + " <" + addr.getAddress() + ">"
				: addr.getAddress();
		}

		if (message.getRecipients(Message.RecipientType.TO) != null) {
			InternetAddress[] recipients = (InternetAddress[]) message.getRecipients(Message.RecipientType.TO);
			if (recipients.length > 0) {
				to = recipients[0].getAddress();
			}
		}

		try {
			Object content = message.getContent();
			if (content instanceof String) {
				body = (String) content;
			}
			else {
				body = "[Complex content - " + message.getContentType() + "]";
			}
		}
		catch (Exception e) {
			body = "[Could not read content]";
		}

		return new Email(
			String.valueOf(messageNumber),
			subject,
			from,
			to,
			message.getSentDate(),
			body
		);
	}

}
