package org.springaicommunity.claude.agent.examples.excel.view;

import java.time.LocalDateTime;

import org.springaicommunity.claude.agent.examples.excel.service.ClaudeService;
import org.springframework.stereotype.Component;

import com.vaadin.flow.component.Key;
import com.vaadin.flow.component.KeyModifier;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.Scroller;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.spring.annotation.SpringComponent;
import com.vaadin.flow.spring.annotation.UIScope;

import org.vaadin.firitin.components.messagelist.MarkdownMessage;
import reactor.core.Disposable;

/**
 * Main chat view for the Excel Demo application.
 *
 * <p>This view demonstrates streaming responses from Claude to a Vaadin UI
 * using thread-safe patterns with ui.access() for all reactive callbacks.
 */
@SpringComponent
@UIScope
@Route("")
@PageTitle("Excel Demo - Claude Agent SDK")
public class ExcelChatView extends VerticalLayout {

	private final ClaudeService claudeService;

	private final VerticalLayout messageList;

	private final Scroller messageScroller;

	private final TextArea inputArea;

	private final Button sendButton;

	private Disposable currentStream;

	private MarkdownMessage currentAssistantMessage;

	public ExcelChatView(ClaudeService claudeService) {
		this.claudeService = claudeService;

		setSizeFull();
		setPadding(false);
		setSpacing(false);

		// Header
		add(createHeader());

		// Message list with scroller
		this.messageList = new VerticalLayout();
		this.messageList.setWidthFull();
		this.messageList.setPadding(true);
		this.messageList.setSpacing(true);

		this.messageScroller = new Scroller(messageList);
		this.messageScroller.setSizeFull();
		this.messageScroller.setScrollDirection(Scroller.ScrollDirection.VERTICAL);
		add(messageScroller);
		setFlexGrow(1, messageScroller);

		// Input area
		this.inputArea = new TextArea();
		this.inputArea.setPlaceholder("Describe the spreadsheet you need... (Shift+Enter for new line)");
		this.inputArea.setWidthFull();
		this.inputArea.setMinHeight("80px");
		this.inputArea.setMaxHeight("150px");
		this.inputArea.addKeyDownListener(Key.ENTER, event -> {
			if (!event.getModifiers().contains(KeyModifier.SHIFT)) {
				sendMessage();
			}
		});

		// Send button
		this.sendButton = new Button("Send", new Icon(VaadinIcon.PAPERPLANE));
		this.sendButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
		this.sendButton.addClickListener(e -> sendMessage());
		this.sendButton.getStyle().set("background-color", "#217346"); // Excel green

		// Input layout
		HorizontalLayout inputLayout = new HorizontalLayout(inputArea, sendButton);
		inputLayout.setWidthFull();
		inputLayout.setPadding(true);
		inputLayout.setSpacing(true);
		inputLayout.setAlignItems(FlexComponent.Alignment.END);
		inputLayout.expand(inputArea);
		inputLayout.getStyle().set("border-top", "1px solid var(--lumo-contrast-10pct)");

		add(inputLayout);

		// Welcome message
		addWelcomeMessage();
	}

	private HorizontalLayout createHeader() {
		H1 title = new H1("Excel Demo");
		title.getStyle().set("margin", "0").set("font-size", "1.5rem").set("color", "#217346");

		Span subtitle = new Span("AI-powered spreadsheet creation");
		subtitle.getStyle().set("color", "var(--lumo-secondary-text-color)");

		VerticalLayout titleLayout = new VerticalLayout(title, subtitle);
		titleLayout.setSpacing(false);
		titleLayout.setPadding(false);

		HorizontalLayout header = new HorizontalLayout(titleLayout);
		header.setWidthFull();
		header.setPadding(true);
		header.setAlignItems(FlexComponent.Alignment.CENTER);
		header.getStyle().set("background-color", "white")
			.set("border-bottom", "1px solid var(--lumo-contrast-10pct)");

		return header;
	}

	private void addWelcomeMessage() {
		MarkdownMessage welcome = new MarkdownMessage("""
				Welcome to Excel Demo!

				I can help you create spreadsheets. Try asking for:
				- A budget tracking template
				- A sales report with formulas
				- A project timeline
				- Data analysis with charts

				Just describe what you need!
				""", "ASSISTANT", LocalDateTime.now());
		welcome.setAvatarColor(MarkdownMessage.Color.AVATAR_PRESETS[1]); // Green-ish
		messageList.add(welcome);
	}

	private void sendMessage() {
		String prompt = inputArea.getValue().trim();
		if (prompt.isEmpty()) {
			return;
		}

		// Cancel any existing stream
		if (currentStream != null && !currentStream.isDisposed()) {
			currentStream.dispose();
		}

		// Clear input and disable while processing
		inputArea.clear();
		setInputEnabled(false);

		// Add user message
		MarkdownMessage userMessage = new MarkdownMessage(prompt, "USER", LocalDateTime.now());
		userMessage.setAvatarColor(MarkdownMessage.Color.AVATAR_PRESETS[0]);
		// Style user message with Excel green
		userMessage.getStyle().set("--markdown-message-user-bg", "#217346").set("--markdown-message-user-color",
				"white");
		messageList.add(userMessage);

		// Create assistant message placeholder
		currentAssistantMessage = new MarkdownMessage("", "ASSISTANT", LocalDateTime.now());
		currentAssistantMessage.setAvatarColor(MarkdownMessage.Color.AVATAR_PRESETS[1]);
		messageList.add(currentAssistantMessage);

		// Scroll to bottom
		scrollToBottom();

		// Get UI reference for thread-safe updates
		UI ui = UI.getCurrent();

		// Stream response from Claude
		currentStream = claudeService.streamText(prompt)
			.doFinally(signal -> ui.access(this::onStreamComplete))
			.doOnError(error -> ui.access(() -> onStreamError(error)))
			.subscribe(text -> ui.access(() -> appendToAssistantMessage(text)));
	}

	private void appendToAssistantMessage(String text) {
		if (currentAssistantMessage != null) {
			currentAssistantMessage.appendMarkdown(text);
			scrollToBottom();
		}
	}

	private void onStreamComplete() {
		setInputEnabled(true);
		currentAssistantMessage = null;
		inputArea.focus();
	}

	private void onStreamError(Throwable error) {
		setInputEnabled(true);

		// Show error notification
		Notification notification = new Notification("Error: " + error.getMessage(), 5000,
				Notification.Position.TOP_CENTER);
		notification.addThemeVariants(NotificationVariant.LUMO_ERROR);
		notification.open();

		// Update assistant message with error
		if (currentAssistantMessage != null) {
			currentAssistantMessage.appendMarkdown("\n\n**Error:** " + error.getMessage());
		}

		currentAssistantMessage = null;
	}

	private void setInputEnabled(boolean enabled) {
		inputArea.setEnabled(enabled);
		sendButton.setEnabled(enabled);

		if (enabled) {
			sendButton.setText("Send");
			sendButton.setIcon(new Icon(VaadinIcon.PAPERPLANE));
		}
		else {
			sendButton.setText("...");
			sendButton.setIcon(new Icon(VaadinIcon.SPINNER));
		}
	}

	private void scrollToBottom() {
		if (messageList.getComponentCount() > 0) {
			messageList.getComponentAt(messageList.getComponentCount() - 1).scrollIntoView();
		}
	}

}
