# Research Agent Example

A multi-agent research coordination system demonstrating `AgentDefinition` and `Task` tool usage.

## Quick Start

```bash
# First time: Build the SDK from the repository root
cd /path/to/claude-agent-sdk-java
./mvnw install -DskipTests

# Then run from this directory
cd examples/research-agent
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

- **AgentDefinition** - Defining specialized subagents with specific tools and prompts
- **Task Tool** - Spawning subagents to handle specific tasks
- **Hook-based Tracking** - Using PreToolUse/PostToolUse hooks to monitor all agent activity
- **Multi-turn Sessions** - Interactive conversation with the lead agent

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      LEAD AGENT                                  │
│  - Orchestrates research tasks                                   │
│  - Only uses Task tool                                           │
│  - Spawns specialized subagents                                  │
└─────────────────────┬───────────────────┬───────────────────────┘
                      │                   │
          ┌───────────▼────────┐ ┌────────▼─────────┐
          │    RESEARCHER(s)   │ │  REPORT-WRITER   │
          │  - WebSearch       │ │  - Glob, Read    │
          │  - Write           │ │  - Write         │
          │  files/research_   │ │  files/reports/  │
          │  notes/*.md        │ │  *.txt           │
          └────────────────────┘ └──────────────────┘
```

## How It Works

1. User asks to research a topic
2. Lead agent breaks topic into 2-4 subtopics
3. Lead agent spawns researcher subagents in parallel
4. Researchers use WebSearch and save findings to `files/research_notes/`
5. Lead agent spawns report-writer after all research is complete
6. Report-writer reads notes and creates summary in `files/reports/`

## Prerequisites

- Java 17+
- Maven 3.8+
- Claude CLI installed and configured
- `ANTHROPIC_API_KEY` environment variable set

## Running the Example

From the repository root:

```bash
cd examples/research-agent
mvn compile exec:java
```

Or from the parent directory:

```bash
mvn -pl examples/research-agent exec:java
```

## Usage

```
=== Research Agent ===
Ask me to research any topic, gather information, or analyze documents.
Type 'exit' or 'quit' to end.

Registered subagents: researcher, report-writer
Session logs: logs/session_20251213_143022

You: Research the latest developments in quantum computing

Agent: Breaking this into 4 research areas: hardware/qubits, algorithms,
industry players, and challenges/timeline. Spawning researchers.

============================================================
SUBAGENT SPAWNED: RESEARCHER-1
============================================================
Task: Quantum hardware and qubits
============================================================

[RESEARCHER-1] -> WebSearch
[RESEARCHER-1] -> WebSearch
[RESEARCHER-1] -> Write

... (more subagents spawn and work) ...

Agent: Research complete. Report saved to files/reports/quantum_computing_summary_20251213.txt

You: exit

Goodbye!
Session logs saved to: logs/session_20251213_143022
```

## Output Files

- `files/research_notes/` - Markdown files with research findings
- `files/reports/` - Final synthesized reports
- `logs/session_YYYYMMDD_HHMMSS/`
  - `tool_calls.jsonl` - Structured log of all tool calls

## Code Overview

### AgentDefinition

Defines a specialized subagent:

```java
AgentDefinition researcher = AgentDefinition.builder()
    .description("Use this agent to gather research information...")
    .tools("WebSearch", "Write")
    .prompt("You are a research specialist...")
    .model("haiku")
    .build();
```

### SubagentTracker

Tracks tool calls using hooks:

```java
SubagentTracker tracker = new SubagentTracker(sessionDir);
HookRegistry registry = tracker.createHookRegistry();

// Use with session
DefaultClaudeSession session = DefaultClaudeSession.builder()
    .hookRegistry(registry)
    .build();
```

### Hook-based Monitoring

The tracker registers PreToolUse and PostToolUse hooks:

- **PreToolUse**: Logs tool calls, associates with subagent context
- **PostToolUse**: Captures results, logs errors

## Key SDK Patterns

| Pattern | Implementation | Purpose |
|---------|----------------|---------|
| AgentDefinition | `AgentDefinition.java` | Define subagent capabilities |
| Hook Registration | `SubagentTracker.createHookRegistry()` | Track all tool calls |
| Session with Hooks | `DefaultClaudeSession.builder().hookRegistry()` | Enable hook callbacks |
| Multi-turn | `session.query()` + `session.responseReceiver()` | Interactive conversation |

## Prompts

The system uses three prompt files:

- `lead_agent.txt` - Orchestration instructions
- `researcher.txt` - Web research guidelines
- `report_writer.txt` - Report synthesis instructions

These can be customized for different research domains or workflows.
