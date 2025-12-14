# Excel Demo

AI-powered spreadsheet creation demo using **Vaadin** + **Claude Agent SDK**.

## Overview

This demo showcases:
- Streaming responses from Claude to a Vaadin web UI
- Thread-safe UI updates using `ui.access()` pattern
- Real-time chat interface with markdown rendering

## Example Use Cases

Try these prompts in the chat interface:

- **Workout Tracker**: "Create a workout tracker spreadsheet with a fitness log and automatic summary statistics"
- **Budget Tracker**: "Create a budget tracker with income, expenses, formulas, and monthly totals"
- **Mortgage Calculator**: "Build a mortgage payment calculator with loan amount, interest rate, term, and an amortization schedule"
- **Sales Report**: "Design a quarterly sales report template with year-over-year comparison"
- **Project Timeline**: "Create a project timeline spreadsheet with tasks, deadlines, and status tracking"

## Prerequisites

- Java 21+
- Maven 3.9+
- Claude CLI installed and authenticated
- **Python 3.x with openpyxl** - Claude uses Python to generate Excel files

```bash
# Install openpyxl if not present
pip install openpyxl
```

## Running

From the `examples/excel-demo` directory:

```bash
# Using Maven wrapper from project root
../../mvnw spring-boot:run

# Or using installed Maven
mvn spring-boot:run
```

The application will start at http://localhost:8080

## Project Structure

```
excel-demo/
├── src/main/java/.../excel/
│   ├── ExcelDemoApplication.java   # Spring Boot entry with @Push
│   ├── view/
│   │   └── ExcelChatView.java      # Main chat UI with streaming
│   └── service/
│       └── ClaudeService.java      # Claude SDK wrapper
├── src/main/resources/
│   ├── application.properties      # Server config
│   └── prompts/
│       └── excel-system-prompt.txt # Claude system prompt
└── pom.xml                         # Dependencies
```

## Key Patterns

### Streaming with Thread Safety

```java
UI ui = UI.getCurrent();
currentStream = claudeService.streamText(prompt)
    .doFinally(signal -> ui.access(this::onStreamComplete))
    .doOnError(error -> ui.access(() -> onStreamError(error)))
    .subscribe(text -> ui.access(() -> appendToMessage(text)));
```

### Claude SDK Usage

```java
// Stream text responses
public Flux<String> streamText(String prompt) {
    QueryOptions options = QueryOptions.builder()
        .systemPrompt(SYSTEM_PROMPT)
        .build();

    // Pass prompt as first argument to ReactiveQuery
    return ReactiveQuery.query(prompt, options)
        .filter(msg -> msg instanceof AssistantMessage)
        .flatMap(msg -> ((AssistantMessage) msg).getTextContent()
            .map(Mono::just).orElse(Mono.empty()));
}
```

## SDK Features Demonstrated

- `ReactiveQuery.query()` - Streaming message responses
- `QueryOptions.builder()` - Custom system prompts
- `Flux<String>` + Vaadin `@Push` - Real-time streaming updates

## Technology Stack

- **Vaadin 24.9** - Server-side UI framework
- **Spring Boot 3.5** - Application framework
- **Viritin 2.19** - MarkdownMessage component
- **Claude Agent SDK** - Claude CLI integration
