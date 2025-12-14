# Email Agent

AI-powered email assistant using **Vaadin** + **Claude Agent SDK** + **IMAP**.

## Overview

This demo showcases:
- Streaming responses from Claude to a Vaadin web UI
- Direct IMAP integration (no local database)
- Non-streaming REST endpoints for programmatic testing
- Docker-based test email server (GreenMail)

## Prerequisites

- Java 21+
- Maven 3.9+
- Docker (for GreenMail test server)
- Claude CLI installed and authenticated
- swaks (for seeding test emails): `sudo apt install swaks`

## Quick Start

### 1. Start the Mail Server

```bash
docker compose up -d
```

This starts GreenMail with:
- IMAP on port 3143
- SMTP on port 3025
- User: `user` / Password: `password`

### 2. Seed Test Emails

```bash
chmod +x src/test/resources/seed-emails.sh
./src/test/resources/seed-emails.sh
```

This creates 5 test emails simulating a meeting planning thread.

### 3. Run the Application

```bash
../../mvnw spring-boot:run
```

The application starts at http://localhost:8081

## Test Endpoints

Non-streaming REST endpoints for programmatic testing:

```bash
# Health check
curl http://localhost:8081/api/test/health

# List recent emails
curl http://localhost:8081/api/test/emails

# Get specific email
curl http://localhost:8081/api/test/emails/1

# Search emails
curl "http://localhost:8081/api/test/emails/search?q=meeting&limit=5"

# Query Claude (non-streaming, waits for complete response)
curl -X POST http://localhost:8081/api/test/query \
  -H "Content-Type: text/plain" \
  -d "Summarize my recent emails about the Q1 planning meeting"
```

## Example Prompts

Try these in the chat interface:

- "Summarize my recent emails"
- "Find emails about the Q1 planning meeting"
- "What action items are mentioned in the meeting thread?"
- "Draft a reply confirming I'll attend the meeting"

## Project Structure

```
email-agent/
├── docker-compose.yml              # GreenMail test server
├── src/main/java/.../email/
│   ├── EmailAgentApplication.java  # Spring Boot + @Push
│   ├── controller/
│   │   └── TestController.java     # REST endpoints (non-SSE)
│   ├── view/
│   │   └── EmailChatView.java      # Vaadin chat UI
│   ├── service/
│   │   ├── ClaudeService.java      # Claude SDK wrapper
│   │   └── ImapService.java        # Direct IMAP access
│   └── model/
│       └── Email.java              # Email record
├── src/main/resources/
│   ├── application.properties      # Config (port 8081)
│   └── prompts/
│       └── email-system-prompt.txt
└── src/test/resources/
    └── seed-emails.sh              # Test data script
```

## Architecture

**Simplified design** - no database:
- Connects directly to IMAP server
- Queries emails in real-time
- Claude uses tools to read/search emails
- Focuses on SDK features, not data management

## SDK Features Demonstrated

- `ReactiveQuery.query()` - Streaming message responses
- `QueryOptions.builder()` - Custom system prompts, timeouts
- `Flux<String>` + Vaadin `@Push` - Real-time streaming updates
- Tool use feedback - Shows `*Using tool: ...*` during execution

## Technology Stack

- **Vaadin 24.9** - Server-side UI framework
- **Spring Boot 3.5** - Application framework
- **Viritin 2.19** - MarkdownMessage component
- **Jakarta Mail (angus-mail)** - IMAP client
- **GreenMail** - Test email server
- **Claude Agent SDK** - Claude CLI integration

## Cleanup

```bash
# Stop mail server
docker compose down

# Remove test data
docker compose down -v
```
