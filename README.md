# Project Detailer

**Your project's memory, powered by AI.**

Project Detailer is a knowledge management tool designed for creators, developers, writers, and teams who need to capture, organize, and retrieve project-specific information effortlessly. Whether you're writing a novel, building software, designing a game, or managing any complex project — Project Detailer helps you store details and query them conversationally.

---

## 🎯 The Problem

Working on complex projects means juggling countless details:
- *Writers* forget character backstories, world-building rules, or plot points
- *Developers* lose track of feature decisions, architectural choices, or legacy code reasoning
- *Game designers* struggle to recall lore, mechanics, or asset specifications

Traditional documentation gets buried. Wikis become outdated. Notes scatter across tools.

---

## 💡 The Solution

Project Detailer lets you:

1. **Create projects** — Organize your work into separate, focused spaces
2. **Add context freely** — Capture any information manually or upload documents
3. **Manage tasks** — Track what needs to be done with AI-assisted task creation
4. **Chat with your project** — Ask questions using AI that *only* knows what you've documented
5. **Extract insights** — Archive conversations into searchable context entries

The AI doesn't hallucinate or make things up. If something isn't in your project data, it tells you — keeping your source of truth reliable.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Multi-project support** | Manage multiple projects, each with its own isolated knowledge base |
| **Context entries** | Add anything: character descriptions, feature specs, meeting notes, design decisions |
| **File uploads** | Upload .txt, .pdf, .md files — automatically chunked and embedded for search |
| **Task management** | Create and track tasks manually or let AI create them from conversations |
| **Vector-powered search** | Content stored with embeddings for semantic retrieval (RAG) |
| **Contextual AI chat** | Ask questions and get answers grounded in your actual project data |
| **Conversation history** | Resume past conversations, rename, or archive them |
| **Extract to Context** | Turn conversation insights into permanent, searchable knowledge |
| **Tool-enabled AI** | Claude can create tasks and context directly from chat |

---

## 🧑‍💻 Who Is This For?

- **Authors & Writers** — Track characters, plot threads, world-building details
- **Software Teams** — Document features, decisions, and institutional knowledge
- **Game Developers** — Manage lore, mechanics, asset details, and design docs
- **Researchers** — Organize findings, sources, and interconnected concepts
- **Anyone** with a complex project that needs a searchable, queryable memory

---

## 🏗️ How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Add Context    │ ──▶ │  Vector DB      │ ──▶ │   AI Chat       │
│  Upload Files   │     │  (Embeddings)   │     │   (RAG Query)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                              │
         │              ┌─────────────────┐             │
         └───────────── │     Tasks       │ ◀───────────┘
                        │  (AI-created)   │
                        └─────────────────┘
```

1. **Create a project** for your book, app, game, or any endeavor
2. **Add context** through forms or file uploads
3. **Chat with your project** — ask questions, create tasks
4. **Archive conversations** — extract insights back into context

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
# CLAUDE_API_KEY - Anthropic API key
# MONGODB_URI - MongoDB connection string
# VOYAGE_API_KEY - Voyage AI API key (for embeddings)

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🛠️ Tech Stack

- **Framework:** Nuxt 4 (Vue 3)
- **Database:** MongoDB with vector search
- **AI:** Claude (Anthropic) for chat and tool use
- **Embeddings:** Voyage AI for semantic search
- **Styling:** Scoped CSS with dark theme

---

## 🔮 Future Plans

### Project Templates
When creating a project, select a project type (Software, Novel, Game, etc.). Based on the type, the project starts pre-populated with:
- **Standard context entries** relevant to that project type
- **Common tasks** to get started
- **Suggested structure** for organizing information

Users can customize, delete, or expand from this starting point.

### Plan My Day
A productivity feature for managing work across projects:
- Click "Plan My Day" when starting work
- AI analyzes your active tasks across all projects
- Considers task priorities, deadlines, and project status
- Suggests a focused list of tasks to tackle today
- Helps prevent overwhelm and decision fatigue

### Additional Ideas
- **Collaboration** — Share projects with team members
- **Export** — Generate documentation from project context
- **Integrations** — Connect with external tools (GitHub, Notion, etc.)
- **Mobile app** — Access your project knowledge on the go

---

## 📄 License

MIT

---

<p align="center">
  <i>Stop losing project details. Start asking questions.</i>
</p>
