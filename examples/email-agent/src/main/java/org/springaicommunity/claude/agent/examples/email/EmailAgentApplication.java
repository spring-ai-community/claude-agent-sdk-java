package org.springaicommunity.claude.agent.examples.email;

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.component.page.Push;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Email Agent Application - AI-powered email assistant.
 *
 * <p>Uses Vaadin for UI with server push for streaming responses,
 * Claude Agent SDK for AI interactions, and Jakarta Mail for IMAP.
 */
@SpringBootApplication
@Push
public class EmailAgentApplication implements AppShellConfigurator {

	public static void main(String[] args) {
		SpringApplication.run(EmailAgentApplication.class, args);
	}

}
