package org.springaicommunity.claude.agent.examples.email.view;

import java.time.LocalDateTime;

import com.vaadin.flow.component.AttachEvent;
import com.vaadin.flow.component.Key;
import com.vaadin.flow.component.KeyModifier;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.Scroller;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.spring.annotation.SpringComponent;
import com.vaadin.flow.spring.annotation.UIScope;

import org.springaicommunity.claude.agent.examples.email.service.ClaudeService;
import org.vaadin.firitin.components.messagelist.MarkdownMessage;

import reactor.core.Disposable;

/**
 * Main chat view for the Email Agent.
 */
@SpringComponent
@UIScope
@Route("")
@PageTitle("Email Agent")
public class EmailChatView extends VerticalLayout {

	private final ClaudeService claudeService;

	private final VerticalLayout messageList;

	private TextArea inputArea;

	private Button sendButton;

	private MarkdownMessage currentAssistantMessage;

	private Disposable currentStream;

	public EmailChatView(ClaudeService claudeService) {
		this.claudeService = claudeService;

		setSizeFull();
		setPadding(false);
		setSpacing(false);

		// Header
		HorizontalLayout header = createHeader();

		// Message list in scroller
		messageList = new VerticalLayout();
		messageList.setWidthFull();
		messageList.setPadding(true);
		messageList.setSpacing(true);

		Scroller scroller = new Scroller(messageList);
		scroller.setSizeFull();
		scroller.setScrollDirection(Scroller.ScrollDirection.VERTICAL);

		// Input area
		HorizontalLayout inputLayout = createInputLayout();

		add(header, scroller, inputLayout);
		expand(scroller);
	}

	private HorizontalLayout createHeader() {
		HorizontalLayout header = new HorizontalLayout();
		header.setWidthFull();
		header.setPadding(true);
		header.setAlignItems(Alignment.CENTER);
		header.getStyle()
			.set("background-color", "#1a73e8")
			.set("color", "white");

		H2 title = new H2("Email Agent");
		title.getStyle().set("margin", "0").set("color", "white");

		Span subtitle = new Span("AI-powered email assistant");
		subtitle.getStyle().set("color", "rgba(255,255,255,0.8)");

		header.add(title, subtitle);
		return header;
	}

	private HorizontalLayout createInputLayout() {
		inputArea = new TextArea();
		inputArea.setPlaceholder("Ask about your emails...");
		inputArea.setWidthFull();
		inputArea.setMinHeight("80px");
		inputArea.setMaxHeight("150px");

		sendButton = new Button("Send");
		sendButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
		sendButton.addClickListener(e -> sendMessage());

		// Enter to send, Shift+Enter for newline
		inputArea.addKeyDownListener(Key.ENTER, event -> {
			if (!event.getModifiers().contains(KeyModifier.SHIFT)) {
				sendButton.click();
			}
		});

		HorizontalLayout inputLayout = new HorizontalLayout(inputArea, sendButton);
		inputLayout.setWidthFull();
		inputLayout.setPadding(true);
		inputLayout.setAlignItems(Alignment.END);
		inputLayout.expand(inputArea);
		inputLayout.getStyle().set("background-color", "#f8f9fa");

		return inputLayout;
	}

	@Override
	protected void onAttach(AttachEvent attachEvent) {
		super.onAttach(attachEvent);
		// Add welcome message
		addAssistantMessage("Hello! I'm your email assistant. I can help you:\n\n" +
			"- **Read and summarize** your recent emails\n" +
			"- **Search** for specific messages\n" +
			"- **Draft replies** to emails\n\n" +
			"What would you like to do?");
	}

	private void sendMessage() {
		String prompt = inputArea.getValue().trim();
		if (prompt.isEmpty()) {
			return;
		}

		// Clear input and disable
		inputArea.clear();
		inputArea.setEnabled(false);
		sendButton.setEnabled(false);

		// Add user message
		addUserMessage(prompt);

		// Create assistant message placeholder
		currentAssistantMessage = new MarkdownMessage("", "ASSISTANT", LocalDateTime.now());
		currentAssistantMessage.setAvatarColor(MarkdownMessage.Color.AVATAR_PRESETS[1]);
		messageList.add(currentAssistantMessage);

		// Stream response
		UI ui = UI.getCurrent();
		currentStream = claudeService.streamText(prompt)
			.doFinally(signal -> ui.access(this::onStreamComplete))
			.doOnError(error -> ui.access(() -> onStreamError(error)))
			.subscribe(text -> ui.access(() -> appendToMessage(text)));
	}

	private void appendToMessage(String text) {
		if (currentAssistantMessage != null) {
			currentAssistantMessage.appendMarkdown(text);
			currentAssistantMessage.scrollIntoView();
		}
	}

	private void onStreamComplete() {
		inputArea.setEnabled(true);
		sendButton.setEnabled(true);
		inputArea.focus();
		currentStream = null;
	}

	private void onStreamError(Throwable error) {
		if (currentAssistantMessage != null) {
			currentAssistantMessage.appendMarkdown("\n\n**Error:** " + error.getMessage());
		}
		onStreamComplete();
	}

	private void addUserMessage(String content) {
		MarkdownMessage msg = new MarkdownMessage(content, "USER", LocalDateTime.now());
		msg.setAvatarColor(MarkdownMessage.Color.AVATAR_PRESETS[0]);
		messageList.add(msg);
		msg.scrollIntoView();
	}

	private void addAssistantMessage(String content) {
		MarkdownMessage msg = new MarkdownMessage(content, "ASSISTANT", LocalDateTime.now());
		msg.setAvatarColor(MarkdownMessage.Color.AVATAR_PRESETS[1]);
		messageList.add(msg);
	}

}
