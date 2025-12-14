package org.springaicommunity.claude.agent.examples.email.service;

import java.util.Date;
import java.util.Properties;

import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Seeds test emails to the mail server.
 * Uses Jakarta Mail SMTP - no external dependencies.
 */
@Service
public class EmailSeeder {

	private static final Logger log = LoggerFactory.getLogger(EmailSeeder.class);

	@Value("${email.smtp.host:localhost}")
	private String smtpHost;

	@Value("${email.smtp.port:3025}")
	private int smtpPort;

	/**
	 * Seeds 5 test emails simulating a meeting planning thread.
	 */
	public int seedTestEmails() {
		int count = 0;
		try {
			Properties props = new Properties();
			props.put("mail.smtp.host", smtpHost);
			props.put("mail.smtp.port", String.valueOf(smtpPort));
			Session session = Session.getInstance(props);

			// Email 1: Initial meeting request
			sendEmail(session, "alice@test.local", "user@test.local",
				"Q1 Planning Meeting - January 15th",
				"""
				Hi team,

				I'd like to schedule our Q1 planning meeting for January 15th.

				Please let me know your availability for that day. I'm thinking we could meet in the afternoon, around 2-4pm.

				Topics to discuss:
				- Q1 budget review
				- Hiring plans
				- Product roadmap updates

				Let me know if you have any scheduling conflicts.

				Best,
				Alice
				""");
			count++;

			// Email 2: Bob's reply
			sendEmail(session, "bob@test.local", "user@test.local",
				"Re: Q1 Planning Meeting - January 15th",
				"""
				Hi Alice,

				January 15th works for me. 2pm is perfect.

				For the agenda, I'd also like to add:
				- Engineering team capacity review
				- Q4 retrospective highlights
				- Technical debt priorities

				I can prepare a brief presentation on the engineering roadmap if helpful.

				Thanks,
				Bob
				""");
			count++;

			// Email 3: Carol's additions
			sendEmail(session, "carol@test.local", "user@test.local",
				"Re: Q1 Planning Meeting - January 15th",
				"""
				Hi all,

				Count me in for January 15th at 2pm.

				A few additional items from the product side:
				- Customer feedback summary from Q4
				- Feature prioritization for Q1
				- Competitive analysis update

				Also, can we book Conference Room A? It has the video setup for remote attendees.

				Thanks,
				Carol
				""");
			count++;

			// Email 4: Alice confirms
			sendEmail(session, "alice@test.local", "user@test.local",
				"Re: Q1 Planning Meeting - January 15th",
				"""
				Great, thanks everyone!

				Confirmed: Q1 Planning Meeting
				Date: Wednesday, January 15th
				Time: 2:00 PM - 4:00 PM
				Location: Conference Room A

				Video link for remote attendees:
				https://meet.example.com/q1-planning

				I've created a shared agenda doc here:
				https://docs.example.com/q1-planning-agenda

				Please add any additional topics by EOD Tuesday.

				See you all there!
				Alice
				""");
			count++;

			// Email 5: Bob's pre-meeting materials
			sendEmail(session, "bob@test.local", "user@test.local",
				"Re: Q1 Planning Meeting - January 15th",
				"""
				Hi team,

				I've uploaded my engineering roadmap slides to the shared folder:
				https://drive.example.com/engineering-q1-roadmap

				Key highlights:
				- 3 major feature releases planned
				- 2 infrastructure upgrades
				- 15% time allocated for tech debt

				Would appreciate if everyone could review before tomorrow's meeting so we can jump straight into discussion.

				See you tomorrow at 2pm!
				Bob
				""");
			count++;

			log.info("Seeded {} test emails successfully", count);
		}
		catch (Exception e) {
			log.error("Failed to seed emails", e);
		}
		return count;
	}

	private void sendEmail(Session session, String from, String to, String subject, String body) throws Exception {
		MimeMessage msg = new MimeMessage(session);
		msg.setFrom(new InternetAddress(from));
		msg.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
		msg.setSubject(subject);
		msg.setText(body);
		msg.setSentDate(new Date());
		Transport.send(msg);
		log.debug("Sent: {} -> {}: {}", from, to, subject);
	}

}
