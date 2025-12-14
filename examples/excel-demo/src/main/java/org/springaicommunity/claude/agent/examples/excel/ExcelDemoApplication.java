package org.springaicommunity.claude.agent.examples.excel;

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.component.page.Push;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Excel Demo Application - AI-powered spreadsheet creation using Vaadin + Claude SDK.
 *
 * <p>This Spring Boot application demonstrates:
 * <ul>
 *   <li>Streaming responses from Claude to Vaadin UI</li>
 *   <li>Thread-safe UI updates using ui.access()</li>
 *   <li>Excel file generation with Apache POI</li>
 * </ul>
 */
@SpringBootApplication
@Push  // Enable server-push for real-time streaming updates
public class ExcelDemoApplication implements AppShellConfigurator {

	public static void main(String[] args) {
		SpringApplication.run(ExcelDemoApplication.class, args);
	}

}
