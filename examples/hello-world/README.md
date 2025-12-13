# Hello World Example

A comprehensive example demonstrating Claude Agent SDK usage patterns from simple to advanced.

## Quick Start

```bash
# First time: Build the SDK from the repository root
cd /path/to/claude-agent-sdk-java
./mvnw install -DskipTests

# Then run from this directory
cd examples/hello-world
./mvnw compile exec:exec

# Run unit tests
./mvnw test
```

Note: The SDK must be installed to your local Maven repository first. After that, you can run the example directly from this directory using the included Maven wrapper.

## Prerequisites

- Java 17+ (`java -version`)
- Claude CLI installed (`claude --version`)
- `ANTHROPIC_API_KEY` environment variable set:
  ```bash
  export ANTHROPIC_API_KEY="your-key-here"
  ```

## Features Demonstrated

1. **Simple Query** - One-liner for quick Claude queries
2. **Query with Options** - Configuring model behavior with system prompts
3. **Full Result with Metadata** - Accessing cost, tokens, and duration
4. **Reactive Streaming** - Real-time response streaming with Project Reactor
5. **Session with Hooks** - Intercepting tool calls with PreToolUse hooks

## Code Overview

### Simple Query API

The most basic usage - just one line of code:

```java
String answer = Query.text("What is 2+2?");
```

### Query with Options

Configure model behavior with custom prompts:

```java
String fact = Query.text("Tell me about Java.",
    QueryOptions.builder()
        .appendSystemPrompt("Be concise.")
        .build());
```

### Full Result with Metadata

Access detailed information about the query:

```java
QueryResult result = Query.execute("Write a haiku.");
System.out.println("Cost: $" + result.metadata().cost().calculateTotal());
System.out.println("Duration: " + result.metadata().getDuration().toMillis() + "ms");
```

### Reactive Streaming

Stream responses in real-time using Project Reactor:

```java
ReactiveQuery.query("Explain recursion.")
    .filter(msg -> msg instanceof AssistantMessage)
    .flatMap(msg -> ((AssistantMessage) msg).getTextContent()
        .map(Mono::just).orElse(Mono.empty()))
    .doOnNext(System.out::print)
    .subscribe();
```

### Session with PreToolUse Hook

Intercept and validate tool calls before execution:

```java
HookRegistry hookRegistry = new HookRegistry();

hookRegistry.registerPreToolUse("Bash", input -> {
    if (input instanceof HookInput.PreToolUseInput preToolUse) {
        String command = preToolUse.getArgument("command", String.class).orElse("");
        if (command.contains("rm -rf")) {
            return HookOutput.block("Dangerous command blocked!");
        }
    }
    return HookOutput.allow();
});

CLIOptions options = CLIOptions.builder()
    .model(CLIOptions.MODEL_HAIKU)
    .permissionMode(PermissionMode.DEFAULT)  // Required for hooks
    .build();

try (DefaultClaudeSession session = DefaultClaudeSession.builder()
        .workingDirectory(Path.of("."))
        .options(options)
        .hookRegistry(hookRegistry)
        .build()) {

    session.connect("Run: echo 'Hello!'");

    try (MessageReceiver receiver = session.responseReceiver()) {
        ParsedMessage msg;
        while ((msg = receiver.next()) != null) {
            // Process messages
        }
    }
}
```

## SDK API Patterns

| Pattern | API | Use Case |
|---------|-----|----------|
| One-shot | `Query.text()` | Simple questions |
| With options | `Query.text(prompt, options)` | Custom model/prompts |
| Full result | `Query.execute()` | Need metadata |
| Streaming | `ReactiveQuery.query()` | Real-time output |
| Multi-turn | `ClaudeSession` | Conversations |
| Tool interception | `HookRegistry` | Security/validation |

## Expected Output

```
Claude Agent SDK - Hello World Example
==================================================

1. Simple Query (one line):
--------------------------------------------------
Answer: 4

2. Query with Options:
--------------------------------------------------
Fun fact: Java was originally called Oak.

3. Full Result with Metadata:
--------------------------------------------------
Haiku:
Lines of code cascade
Logic flows like morning light
Bugs flee to shadows

Metadata:
  - Model: claude-haiku-4-5-20251001
  - Cost: $0.000234
  - Duration: 1523ms
  - Turns: 1

4. Reactive Streaming:
--------------------------------------------------
Response (streaming):
Recursion is when a function calls itself...
[Streamed 245 characters]

5. Session with PreToolUse Hook:
--------------------------------------------------
[Hook] Bash tool intercepted (call #1)
[Hook] Command: echo 'Hello from hooks!'
[Hook] Allowing Bash execution

Session response:
Claude: I've run the command. Here's the output...

[Hook was triggered 1 time(s)]

==================================================
All examples completed successfully!
```
