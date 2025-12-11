# Claude Agent SDK for Java

Java SDK for interacting with [Claude Code CLI](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview). This is a pure Java implementation that mirrors the design of the official Python and TypeScript Claude Agent SDKs.

## Features

| Feature | Description |
|---------|-------------|
| **Multiple API Styles** | Blocking iterator, streaming receiver, and reactive Flux APIs |
| **Bidirectional Sessions** | Persistent multi-turn conversations with context preservation |
| **Hook System** | Register callbacks for tool use events (pre/post tool execution) |
| **Tool Permission Control** | Programmatic control over tool execution approval |
| **MCP Integration** | Support for Model Context Protocol servers |
| **Resilience** | Built-in retry and circuit breaker patterns |
| **Streaming** | Real-time message streaming with backpressure support |

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

## Quick Start

### Iterator Pattern (Blocking)

```java
try (ClaudeSession session = DefaultClaudeSession.builder()
        .workingDirectory(Path.of("."))
        .build()) {

    session.connect("What is 2+2?");

    Iterator<ParsedMessage> messages = session.receiveResponse();
    while (messages.hasNext()) {
        ParsedMessage msg = messages.next();
        if (msg.isRegularMessage()) {
            Message message = msg.asMessage();
            if (message instanceof AssistantMessage assistant) {
                assistant.getTextContent().ifPresent(System.out::println);
            }
        }
    }
}
```

### MessageReceiver Pattern (Blocking with Timeout)

```java
try (ClaudeSession session = DefaultClaudeSession.builder()
        .workingDirectory(Path.of("."))
        .build()) {

    session.connect("Explain recursion briefly.");

    MessageReceiver receiver = session.responseReceiver();
    ParsedMessage msg;
    while ((msg = receiver.receive(Duration.ofSeconds(30))) != null) {
        // Process message
    }
}
```

### Reactive Flux Pattern

```java
ReactiveTransport transport = new ReactiveTransport(Path.of("."));

CLIOptions options = CLIOptions.builder()
    .model("claude-sonnet-4-20250514")
    .permissionMode(PermissionMode.BYPASS_PERMISSIONS)
    .build();

transport.streamQuery("Explain quantum computing", options)
    .filter(msg -> msg instanceof AssistantMessage)
    .map(msg -> ((AssistantMessage) msg).getTextContent())
    .filter(Optional::isPresent)
    .map(Optional::get)
    .subscribe(System.out::println);
```

## Multi-Turn Conversations

```java
try (ClaudeSession session = DefaultClaudeSession.builder()
        .workingDirectory(Path.of("."))
        .build()) {

    // First turn
    session.connect("My name is Alice.");
    consumeResponse(session.receiveResponse());

    // Second turn - context is preserved
    session.query("What's my name?");
    consumeResponse(session.receiveResponse());
}
```

## Configuration Options

```java
CLIOptions options = CLIOptions.builder()
    .model("claude-sonnet-4-20250514")           // Model selection
    .permissionMode(PermissionMode.DEFAULT)      // Permission handling
    .systemPrompt("You are a helpful assistant") // System prompt
    .appendSystemPrompt("Be concise")            // Additional instructions
    .maxTurns(10)                                // Limit conversation turns
    .timeout(Duration.ofMinutes(5))              // Operation timeout
    .allowedTools(List.of("Read", "Grep"))       // Restrict tool access
    .disallowedTools(List.of("Bash"))            // Block specific tools
    .build();
```

## Hook System

Register callbacks for tool execution events:

```java
DefaultClaudeSession session = DefaultClaudeSession.builder()
    .workingDirectory(Path.of("."))
    .build();

// Block dangerous operations
session.registerHook(HookEvent.PRE_TOOL_USE, "Bash", input -> {
    if (input.toolInput().toString().contains("rm -rf")) {
        return HookOutput.block("Dangerous command blocked");
    }
    return HookOutput.allow();
});

// Log all tool completions
session.registerHook(HookEvent.POST_TOOL_USE, null, input -> {
    System.out.println("Tool completed: " + input.toolName());
    return HookOutput.allow();
});
```

## Tool Permission Callback

Programmatic control over tool execution:

```java
session.setToolPermissionCallback((toolName, input, context) -> {
    if (toolName.equals("Write") && input.toString().contains("/etc/")) {
        return PermissionResult.deny("Cannot write to system directories");
    }
    return PermissionResult.allow();
});
```

## Project Structure

```
claude-agent-sdk-java/
├── claude-code-sdk/          # Core SDK module
│   └── src/
│       ├── main/java/org/springaicommunity/claudecode/sdk/
│       │   ├── session/      # ClaudeSession, DefaultClaudeSession
│       │   ├── transport/    # BidirectionalTransport, ReactiveTransport
│       │   ├── streaming/    # MessageReceiver, MessageStreamIterator
│       │   ├── hooks/        # HookRegistry, HookCallback
│       │   ├── permission/   # ToolPermissionCallback
│       │   ├── mcp/          # MCP server configuration
│       │   ├── types/        # Message types, content blocks
│       │   └── parsing/      # JSON parsing, control messages
│       └── test/
└── examples/
    └── hello-world/          # Simple usage example
```

## License

Apache License 2.0

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
