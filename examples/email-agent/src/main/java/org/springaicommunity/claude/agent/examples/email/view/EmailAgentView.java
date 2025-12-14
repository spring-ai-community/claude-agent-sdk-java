package org.springaicommunity.claude.agent.examples.email.view;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.List;

import com.vaadin.flow.component.AttachEvent;
import com.vaadin.flow.component.Key;
import com.vaadin.flow.component.KeyModifier;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Pre;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.Scroller;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.splitlayout.SplitLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.spring.annotation.SpringComponent;
import com.vaadin.flow.spring.annotation.UIScope;

import org.springaicommunity.claude.agent.examples.email.model.Email;
import org.springaicommunity.claude.agent.examples.email.service.ClaudeService;
import org.springaicommunity.claude.agent.examples.email.service.ImapService;
import org.vaadin.firitin.components.messagelist.MarkdownMessage;

import reactor.core.Disposable;

/**
 * Main Email Agent view with 3-pane layout matching the original design.
 *
 * Layout: [Email List] [Content Area] [Chat Panel] - all resizable via drag splitters
 */
@SpringComponent
@UIScope
@CssImport("./styles/email-agent-styles.css")
@Route("")
@PageTitle("Email Agent")
public class EmailAgentView extends Div {

	private final ClaudeService claudeService;
	private final ImapService imapService;

	// Left panel - Email list
	private VerticalLayout emailListPanel;
	private VerticalLayout emailList;
	private Span emailCountBadge;

	// Center panel - Content area
	private VerticalLayout contentArea;

	// Right panel - Chat
	private VerticalLayout chatPanel;
	private VerticalLayout messageList;
	private TextField chatInput;
	private Button sendButton;

	private MarkdownMessage currentAssistantMessage;
	private Disposable currentStream;
	private Email selectedEmail;

	public EmailAgentView(ClaudeService claudeService, ImapService imapService) {
		this.claudeService = claudeService;
		this.imapService = imapService;

		setSizeFull();
		getStyle().set("background-color", "white");

		// Create panels
		emailListPanel = createEmailListPanel();
		contentArea = createContentArea();
		chatPanel = createChatPanel();

		// Create nested SplitLayouts for 3-pane resizable layout
		// Inner split: Content Area | Chat Panel
		SplitLayout innerSplit = new SplitLayout(contentArea, chatPanel);
		innerSplit.setSizeFull();
		innerSplit.setSplitterPosition(70); // Content gets 70%, chat gets 30%

		// Outer split: Email List | (Content + Chat)
		SplitLayout outerSplit = new SplitLayout(emailListPanel, innerSplit);
		outerSplit.setSizeFull();
		outerSplit.setSplitterPosition(25); // Email list gets 25%

		add(outerSplit);
	}

	private VerticalLayout createEmailListPanel() {
		VerticalLayout panel = new VerticalLayout();
		panel.setSizeFull();
		panel.setMinWidth("200px");
		panel.setPadding(false);
		panel.setSpacing(false);
		panel.getStyle()
			.set("background-color", "white");

		// Header
		HorizontalLayout header = new HorizontalLayout();
		header.setWidthFull();
		header.setPadding(true);
		header.setAlignItems(FlexComponent.Alignment.CENTER);
		header.getStyle().set("border-bottom", "1px solid #e5e7eb");

		Icon mailIcon = VaadinIcon.ENVELOPE.create();
		mailIcon.setSize("20px");
		mailIcon.getStyle().set("color", "#374151");

		Span title = new Span("Inbox");
		title.getStyle()
			.set("font-weight", "600")
			.set("font-size", "14px")
			.set("margin-left", "8px");

		emailCountBadge = new Span("0");
		emailCountBadge.getStyle()
			.set("background-color", "#e5e7eb")
			.set("padding", "2px 8px")
			.set("border-radius", "12px")
			.set("font-size", "12px")
			.set("margin-left", "auto");

		Button refreshBtn = new Button(VaadinIcon.REFRESH.create());
		refreshBtn.addThemeVariants(ButtonVariant.LUMO_TERTIARY_INLINE);
		refreshBtn.addClickListener(e -> loadEmails());

		header.add(mailIcon, title, emailCountBadge, refreshBtn);

		// Email list (scrollable)
		emailList = new VerticalLayout();
		emailList.setPadding(false);
		emailList.setSpacing(false);
		emailList.setWidthFull();

		Scroller scroller = new Scroller(emailList);
		scroller.setSizeFull();

		panel.add(header, scroller);
		panel.expand(scroller);

		return panel;
	}

	private VerticalLayout createContentArea() {
		VerticalLayout area = new VerticalLayout();
		area.setSizeFull();
		area.setPadding(true);
		area.getStyle().set("background-color", "#f9fafb");

		Div placeholder = new Div();
		placeholder.setText("Select an email to view its contents");
		placeholder.getStyle()
			.set("color", "#6b7280")
			.set("text-align", "center")
			.set("margin-top", "100px");

		area.add(placeholder);
		area.setAlignItems(FlexComponent.Alignment.CENTER);

		return area;
	}

	private VerticalLayout createChatPanel() {
		VerticalLayout panel = new VerticalLayout();
		panel.setSizeFull();
		panel.setMinWidth("250px");
		panel.setPadding(false);
		panel.setSpacing(false);
		panel.getStyle()
			.set("background-color", "white");

		// Header
		HorizontalLayout header = new HorizontalLayout();
		header.setWidthFull();
		header.setPadding(true);
		header.setAlignItems(FlexComponent.Alignment.CENTER);
		header.getStyle().set("border-bottom", "1px solid #e5e7eb");

		Span title = new Span("EMAIL AGENT");
		title.getStyle()
			.set("font-weight", "600")
			.set("font-size", "12px")
			.set("letter-spacing", "0.05em")
			.set("color", "#374151");

		Span status = new Span("ONLINE");
		status.getStyle()
			.set("font-size", "10px")
			.set("color", "#10b981")
			.set("margin-left", "auto");

		header.add(title, status);

		// Message list
		messageList = new VerticalLayout();
		messageList.setPadding(true);
		messageList.setSpacing(true);
		messageList.setWidthFull();

		Scroller scroller = new Scroller(messageList);
		scroller.setSizeFull();

		// Input area
		HorizontalLayout inputArea = new HorizontalLayout();
		inputArea.setWidthFull();
		inputArea.setPadding(true);
		inputArea.setSpacing(true);
		inputArea.getStyle().set("border-top", "1px solid #e5e7eb");

		chatInput = new TextField();
		chatInput.setPlaceholder("Ask about emails...");
		chatInput.setWidthFull();
		chatInput.getStyle().set("font-size", "14px");

		sendButton = new Button(VaadinIcon.PAPERPLANE.create());
		sendButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
		sendButton.addClickListener(e -> sendMessage());

		chatInput.addKeyDownListener(Key.ENTER, e -> {
			if (!e.getModifiers().contains(KeyModifier.SHIFT)) {
				sendButton.click();
			}
		});

		inputArea.add(chatInput, sendButton);
		inputArea.expand(chatInput);

		panel.add(header, scroller, inputArea);
		panel.expand(scroller);

		return panel;
	}

	@Override
	protected void onAttach(AttachEvent attachEvent) {
		super.onAttach(attachEvent);
		loadEmails();
		addWelcomeMessage();
	}

	private void loadEmails() {
		List<Email> emails = imapService.fetchRecent(20);
		emailCountBadge.setText(String.valueOf(emails.size()));

		emailList.removeAll();
		for (Email email : emails) {
			emailList.add(createEmailRow(email));
		}
	}

	private Div createEmailRow(Email email) {
		Div row = new Div();
		row.setWidthFull();
		row.getStyle()
			.set("padding", "12px 16px")
			.set("border-bottom", "1px solid #f3f4f6")
			.set("cursor", "pointer");

		// Hover effect
		row.getElement().addEventListener("mouseenter", e ->
			row.getStyle().set("background-color", "#f9fafb"));
		row.getElement().addEventListener("mouseleave", e ->
			row.getStyle().set("background-color", "white"));

		// Click to view
		row.addClickListener(e -> showEmailDialog(email));

		// Sender line
		Div senderLine = new Div();
		senderLine.getStyle()
			.set("display", "flex")
			.set("justify-content", "space-between")
			.set("margin-bottom", "4px");

		Span sender = new Span(extractSenderName(email.from()));
		sender.getStyle()
			.set("font-weight", "600")
			.set("font-size", "14px")
			.set("color", "#111827");

		Span date = new Span(formatDate(email.sentDate()));
		date.getStyle()
			.set("font-size", "12px")
			.set("color", "#9ca3af");

		senderLine.add(sender, date);

		// Subject
		Div subject = new Div();
		subject.setText(truncate(email.subject(), 50));
		subject.getStyle()
			.set("font-size", "14px")
			.set("color", "#374151")
			.set("margin-bottom", "4px");

		// Preview
		Div preview = new Div();
		preview.setText(truncate(email.body(), 80));
		preview.getStyle()
			.set("font-size", "12px")
			.set("color", "#6b7280")
			.set("overflow", "hidden")
			.set("text-overflow", "ellipsis")
			.set("white-space", "nowrap");

		row.add(senderLine, subject, preview);
		return row;
	}

	private void showEmailDialog(Email email) {
		selectedEmail = email;

		Dialog dialog = new Dialog();
		dialog.setWidth("800px");
		dialog.setHeight("600px");
		dialog.setCloseOnOutsideClick(true);

		VerticalLayout content = new VerticalLayout();
		content.setPadding(true);
		content.setSizeFull();

		// Header
		H3 subject = new H3(email.subject());
		subject.getStyle().set("margin", "0 0 16px 0");

		Div meta = new Div();
		meta.getStyle().set("font-size", "14px").set("color", "#6b7280");
		meta.add(new Paragraph("From: " + email.from()));
		meta.add(new Paragraph("To: " + email.to()));
		meta.add(new Paragraph("Date: " + (email.sentDate() != null ? email.sentDate().toString() : "Unknown")));

		// Body
		Pre body = new Pre();
		body.setText(email.body());
		body.getStyle()
			.set("white-space", "pre-wrap")
			.set("font-family", "inherit")
			.set("font-size", "14px")
			.set("background-color", "#f9fafb")
			.set("padding", "16px")
			.set("border-radius", "8px")
			.set("overflow", "auto")
			.set("flex-grow", "1");

		Scroller bodyScroller = new Scroller(body);
		bodyScroller.setSizeFull();

		content.add(subject, meta, bodyScroller);
		content.expand(bodyScroller);

		dialog.add(content);
		dialog.open();
	}

	private void addWelcomeMessage() {
		addAssistantMessage("Hello! I can help you with your emails.\n\n" +
			"Try asking:\n" +
			"- \"Summarize the Q1 planning meeting thread\"\n" +
			"- \"What action items are in these emails?\"\n" +
			"- \"Find emails from Alice\"");
	}

	private void sendMessage() {
		String prompt = chatInput.getValue().trim();
		if (prompt.isEmpty()) return;

		chatInput.clear();
		chatInput.setEnabled(false);
		sendButton.setEnabled(false);

		addUserMessage(prompt);

		currentAssistantMessage = new MarkdownMessage("", "ASSISTANT", LocalDateTime.now());
		currentAssistantMessage.setAvatarColor(MarkdownMessage.Color.AVATAR_PRESETS[1]);
		messageList.add(currentAssistantMessage);

		UI ui = UI.getCurrent();
		currentStream = claudeService.streamText(prompt)
			.doFinally(signal -> ui.access(this::onStreamComplete))
			.doOnError(error -> ui.access(() -> onStreamError(error)))
			.subscribe(text -> ui.access(() -> {
				currentAssistantMessage.appendMarkdown(text);
				currentAssistantMessage.scrollIntoView();
			}));
	}

	private void onStreamComplete() {
		chatInput.setEnabled(true);
		sendButton.setEnabled(true);
		chatInput.focus();
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

	private String extractSenderName(String from) {
		if (from == null) return "Unknown";
		int idx = from.indexOf('<');
		if (idx > 0) {
			return from.substring(0, idx).trim();
		}
		idx = from.indexOf('@');
		if (idx > 0) {
			return from.substring(0, idx);
		}
		return from;
	}

	private String formatDate(java.util.Date date) {
		if (date == null) return "";
		SimpleDateFormat sdf = new SimpleDateFormat("MMM d");
		return sdf.format(date);
	}

	private String truncate(String text, int max) {
		if (text == null) return "";
		text = text.replace("\r\n", " ").replace("\n", " ");
		if (text.length() <= max) return text;
		return text.substring(0, max) + "...";
	}

}
