# Claude Agent SDK for Java

Java SDK for interacting with [Claude Code CLI](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview). This is a pure Java implementation that mirrors the design of the official Python and TypeScript Claude Agent SDKs.

## Features

| Feature | Description |
|---------|-------------|
| **Simple One-Shot API** | `Query.text()` for quick answers in one line |
| **Blocking Client** | `ClaudeSyncClient` for multi-turn conversations with Iterator |
| **Reactive Client** | `ClaudeAsyncClient` with Flux/Mono for Spring WebFlux |
| **Hook System** | Register callbacks for tool use events |
| **MCP Integration** | Support for Model Context Protocol servers |
| **Permission Callbacks** | Programmatic control over tool execution |

## Requirements

- Java 17+
- Claude Code CLI installed and authenticated
- Maven 3.8+

## Installation

> **Note**: This project is currently available as a SNAPSHOT. Releases to Maven Central are coming soon.

### Maven

Add the snapshot repository and dependency to your `pom.xml`:

```xml
<repositories>
    <repository>
        <id>central-snapshots</id>
        <url>https://central.sonatype.com/repository/maven-snapshots/</url>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>org.springaicommunity</groupId>
        <artifactId>claude-code-sdk</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

### Gradle

Add the snapshot repository and dependency to your `build.gradle`:

```groovy
repositories {
    mavenCentral()
    maven {
        url 'https://central.sonatype.com/repository/maven-snapshots/'
    }
}

dependencies {
    implementation 'org.springaicommunity:claude-code-sdk:1.0.0-SNAPSHOT'
}
```

### Building from Source

```bash
git clone https://github.com/spring-ai-community/claude-agent-sdk-java.git
cd claude-agent-sdk-java
./mvnw install
```

## Three API Styles

| API | Class | Programming Style | Best For |
|-----|-------|-------------------|----------|
| **One-shot** | `Query` | Static methods | Simple scripts, CLI tools |
| **Blocking** | `ClaudeSyncClient` | Iterator-based | Traditional applications, synchronous workflows |
| **Reactive** | `ClaudeAsyncClient` | Flux/Mono | Non-blocking applications, high concurrency |

Both `ClaudeSyncClient` and `ClaudeAsyncClient` support the full feature set: multi-turn conversations, hooks, MCP integration, and permission callbacks. They differ only in programming paradigm (blocking vs non-blocking).

**Factory Pattern**: Use `ClaudeClient.sync()` or `ClaudeClient.async()` to create clients.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR APPLICATION                          │
└───────────────┬─────────────────────┬─────────────────┬─────────┘
                │                     │                 │
                ▼                     ▼                 ▼
┌───────────────────┐   ┌───────────────────┐   ┌─────────────────┐
│      Query        │   │  ClaudeSyncClient │   │ ClaudeAsyncClient│
│   (one-shot)      │   │    (blocking)     │   │   (reactive)    │
│                   │   │                   │   │                 │
│  Query.text()     │   │  Iterator-based   │   │   Flux/Mono     │
│  Query.execute()  │   │  Multi-turn       │   │   Spring WebFlux│
└─────────┬─────────┘   └─────────┬─────────┘   └────────┬────────┘
          │                       │                      │
          └───────────────────────┼──────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      StreamingTransport                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  • Subprocess management (Process API)                      ││
│  │  • JSON-LD streaming via stdin/stdout                       ││
│  │  • State machine: DISCONNECTED → CONNECTED → CLOSED         ││
│  │  • Thread-safe with separate schedulers                     ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Claude Code CLI                           │
│                   (claude --output-format stream-json)           │
└─────────────────────────────────────────────────────────────────┘
```

### Message Flow

```
┌──────────────┐          ┌─────────────────┐          ┌──────────┐
│  Your Code   │          │ StreamingTransport│          │ Claude   │
└──────┬───────┘          └────────┬────────┘          └────┬─────┘
       │                           │                        │
       │  connect("Hello")         │                        │
       │ ─────────────────────────>│ spawn process          │
       │                           │ ──────────────────────>│
       │                           │                        │
       │                           │    SystemMessage       │
       │                           │<───────────────────────│
       │   Iterator/Flux yields    │                        │
       │<──────────────────────────│    AssistantMessage    │
       │                           │<───────────────────────│
       │   process message...      │                        │
       │<──────────────────────────│    ResultMessage       │
       │                           │<───────────────────────│
       │   (turn complete)         │                        │
       │                           │                        │
       │  query("Follow-up")       │                        │
       │ ─────────────────────────>│ write to stdin         │
       │                           │ ──────────────────────>│
       │                           │                        │
       │   Iterator/Flux yields    │    AssistantMessage    │
       │<──────────────────────────│<───────────────────────│
       │                           │                        │
       │  close()                  │ terminate process      │
       │ ─────────────────────────>│ ──────────────────────>│
       │                           │                        │
       ▼                           ▼                        ▼
```

---

## API 1: Query (Simple One-Shot)

The simplest way to use Claude - one line of code:

```java
import org.springaicommunity.claude.agent.sdk.Query;

String answer = Query.text("What is 2+2?");
System.out.println(answer);  // "4"
```

### With Options

```java
String answer = Query.text("Explain quantum computing",
    QueryOptions.builder()
        .model("claude-sonnet-4-20250514")
        .appendSystemPrompt("Be concise")
        .timeout(Duration.ofMinutes(5))
        .build());
```

### Full Result with Metadata

```java
QueryResult result = Query.execute("Write a haiku about Java");
result.text().ifPresent(System.out::println);
System.out.println("Cost: $" + result.metadata().cost().calculateTotal());
System.out.println("Duration: " + result.metadata().getDuration().toMillis() + "ms");
```

---

## API 2: ClaudeSyncClient (Blocking/Iterator)

For multi-turn conversations, hooks, and MCP servers:

```java
import org.springaicommunity.claude.agent.sdk.ClaudeClient;
import org.springaicommunity.claude.agent.sdk.ClaudeSyncClient;

try (ClaudeSyncClient client = ClaudeClient.sync()
        .workingDirectory(Path.of("."))
        .model("claude-sonnet-4-20250514")
        .build()) {

    // Simplest: just get the text (80% use case)
    String answer = client.connectText("What is 2+2?");
    System.out.println(answer);  // "4"

    // Follow-up with context preserved
    String followUp = client.queryText("Multiply that by 10");
    System.out.println(followUp);  // "40"
}
```

### Full Message Access (20% use case)

When you need message metadata, tool use details, or cost information:

```java
try (ClaudeSyncClient client = ClaudeClient.sync()
        .workingDirectory(Path.of("."))
        .build()) {

    // For-each with good toString() on all message types
    for (Message msg : client.connectAndReceive("List files in current directory")) {
        System.out.println(msg);  // AssistantMessage, ResultMessage, etc.
    }
}
```

### With Hooks

```java
HookRegistry hookRegistry = new HookRegistry();

// Block dangerous commands
hookRegistry.registerPreToolUse("Bash", input -> {
    if (input instanceof HookInput.PreToolUseInput preToolUse) {
        String cmd = preToolUse.getArgument("command", String.class).orElse("");
        if (cmd.contains("rm -rf")) {
            return HookOutput.block("Dangerous command blocked");
        }
    }
    return HookOutput.allow();
});

try (ClaudeSyncClient client = ClaudeClient.sync()
        .workingDirectory(Path.of("."))
        .permissionMode(PermissionMode.DEFAULT)
        .hookRegistry(hookRegistry)
        .build()) {
    // Hooks intercept tool calls
}
```

---

## API 3: ClaudeAsyncClient (Reactive)

For reactive applications using Project Reactor:

```java
ClaudeAsyncClient client = ClaudeClient.async()
    .workingDirectory(Path.of("."))
    .model("claude-sonnet-4-20250514")
    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
    .build();

// Stream text as it arrives
client.connect("Explain recursion").textStream()
    .doOnNext(System.out::print)
    .subscribe();
```

### Multi-Turn with flatMap Chaining

```java
client.connect("My favorite color is blue.").text()
    .doOnSuccess(System.out::println)
    .flatMap(r1 -> client.query("What is my favorite color?").text())
    .doOnSuccess(System.out::println)  // Claude remembers: "blue"
    .flatMap(r2 -> client.query("Spell it backwards").text())
    .doOnSuccess(System.out::println)  // "eulb"
    .subscribe();
```

### Full Message Access (20% use case)

When you need all message types (tool use, metadata, etc.):

```java
client.query("List files").messages()
    .doOnNext(System.out::println)  // Good toString() on all types
    .subscribe();
```

---

## Configuration Options

```java
// Via ClaudeClient builder
ClaudeSyncClient client = ClaudeClient.sync()
    .workingDirectory(Path.of("."))
    .model("claude-sonnet-4-20250514")
    .systemPrompt("You are a helpful assistant")
    .permissionMode(PermissionMode.DEFAULT)
    .timeout(Duration.ofMinutes(5))
    .hookRegistry(hookRegistry)
    .build();

// Or via CLIOptions
CLIOptions options = CLIOptions.builder()
    .model("claude-sonnet-4-20250514")
    .permissionMode(PermissionMode.DEFAULT)
    .systemPrompt("You are a helpful assistant")
    .appendSystemPrompt("Be concise")
    .maxTurns(10)
    .allowedTools(List.of("Read", "Grep"))
    .disallowedTools(List.of("Bash"))
    .build();

ClaudeSyncClient client = ClaudeClient.sync(options)
    .workingDirectory(Path.of("."))
    .build();
```

---

## Project Structure

```
claude-agent-sdk-java/
├── claude-code-sdk/          # Core SDK module
│   └── src/
│       ├── main/java/org/springaicommunity/claude/agent/sdk/
│       │   ├── Query.java              # Simple one-shot API
│       │   ├── ClaudeClient.java       # Factory: sync() / async()
│       │   ├── ClaudeSyncClient.java   # Blocking client interface
│       │   ├── ClaudeAsyncClient.java  # Reactive client interface
│       │   ├── transport/              # StreamingTransport
│       │   ├── streaming/              # MessageStreamIterator
│       │   ├── hooks/                  # HookRegistry, HookCallback
│       │   ├── permission/             # ToolPermissionCallback
│       │   ├── mcp/                    # MCP server configuration
│       │   ├── types/                  # Message types, content blocks
│       │   └── parsing/                # JSON parsing, control messages
│       └── test/
└── examples/
    ├── hello-world/          # All three APIs demonstrated
    ├── email-agent/          # ClaudeAsyncClient with Vaadin UI
    ├── excel-demo/           # ClaudeAsyncClient streaming
    └── research-agent/       # ClaudeSyncClient multi-turn with hooks
```

---

## Python SDK Feature Comparison

The Java SDK mirrors the official [Python Claude Agent SDK](https://github.com/anthropics/claude-code-sdk-python). Current feature parity status:

| Feature | Python | Java | Notes |
|---------|:------:|:----:|-------|
| **Core APIs** | | | |
| One-shot queries | ✓ | ✓ | `Query.text()`, `Query.execute()` |
| Blocking client | ✓ | ✓ | `ClaudeClient.sync()` |
| Async client | ✓ | ✓ | `ClaudeClient.async()` (Reactor) |
| Multi-turn conversations | ✓ | ✓ | Context preserved across turns |
| **Configuration** | | | |
| Model selection | ✓ | ✓ | `.model()` or `CLIOptions` |
| System prompt | ✓ | ✓ | `.systemPrompt()` |
| Append system prompt | ✓ | ✓ | `.appendSystemPrompt()` |
| Permission modes | ✓ | ✓ | `PermissionMode` enum |
| Allowed/disallowed tools | ✓ | ✓ | `.allowedTools()`, `.disallowedTools()` |
| Max turns | ✓ | ✓ | `.maxTurns()` |
| Max tokens | ✓ | ✓ | `.maxTokens()` |
| **Extensibility** | | | |
| Hook system (PreToolUse) | ✓ | ✓ | `HookRegistry.registerPreToolUse()` |
| Hook system (PostToolUse) | ✓ | ✓ | `HookRegistry.registerPostToolUse()` |
| MCP server integration | ✓ | ✓ | External + in-process servers |
| Permission callbacks | ✓ | ✓ | `ToolPermissionCallback` |
| Agent definitions | ✓ | ✓ | `AgentDefinition` for subagents |
| **Advanced** | | | |
| File checkpointing | ✓ | ✗ | Not yet implemented |
| Beta features (`--betas`) | ✓ | ✗ | Not yet implemented |
| Sandbox settings | ✓ | ✗ | Not yet implemented |

### Key Differences

1. **Reactive Streaming**: Java SDK uses [Project Reactor](https://projectreactor.io/) (Flux/Mono) for reactive streams, while Python uses async generators.

2. **Factory Pattern**: Java follows the MCP Java SDK pattern with `ClaudeClient.sync()` / `ClaudeClient.async()` factory methods.

3. **Iterator vs Iterable**: `ClaudeSyncClient.receiveResponse()` returns `Iterator<ParsedMessage>` (not `Iterable`), requiring `while (response.hasNext())` pattern.

4. **Type Safety**: Java SDK leverages sealed interfaces and pattern matching for message type handling.

## License

Apache License 2.0

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
