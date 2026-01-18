# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScholarSearch is an academic literature search platform with AI-powered research assistance. The application aggregates papers from multiple sources (PubMed, Google Scholar, Embase, bioRxiv, medRxiv) and provides an integrated AI chat assistant for research insights.

## Development Commands

**Note**: This project uses `pnpm` as the package manager (version 10.6.3+).

```bash
# Install dependencies
pnpm install

# Start development server (localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Technology Stack

- **Framework**: Next.js 16.1.1 (App Router architecture)
- **Runtime**: React 19.2.3 with TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components (New York style)
- **Package Manager**: pnpm
- **AI Integration**: Vercel AI SDK (@ai-sdk/openai, ai)
- **Markdown**: react-markdown with remark-gfm and rehype-raw

## Architecture

### App Router Structure

The application uses Next.js App Router with file-based routing in `src/app/`:

- `page.tsx` - Home page with search interface
- `search/page.tsx` - Main search results page with AI chat split-pane view
- `saved-searches/page.tsx` - Saved searches management
- `profile/page.tsx` - User profile
- `settings/page.tsx` - Application settings
- `login/page.tsx` - Authentication
- `help/page.tsx` - Help documentation

### Component Architecture

**UI Components**: Located in `src/components/ui/`, managed by shadcn/ui
- Uses Radix UI primitives with Tailwind CSS styling
- Components include: Button, Card, Input, Badge, Tabs, Label
- Styled with CSS variables and base color "neutral"
- Fully responsive with dark mode support

**shadcn/ui Configuration** (from `components.json`):
- Style: "new-york"
- RSC: True (React Server Components)
- TypeScript: True
- Path aliases configured for easy imports

### Key Features

**Search Functionality**:
- Multi-source academic search (PubMed, Google Scholar, Embase, bioRxiv, medRxiv)
- Source filtering with color-coded badges
- Search history with dropdown
- Quick search examples
- Currently uses mock data for development

**AI Chat Assistant**:
- Integrated into `/search` page in resizable split-pane layout (70/30 default)
- Real-time chat with message history
- Markdown rendering for formatted responses (supporting GitHub Flavored Markdown)
- Typing indicators and auto-scroll
- Vercel AI SDK integration for streaming responses
- Multi-agent system with specialized research agents

## AI Agent System

The application uses the Vercel AI SDK to implement a multi-agent research assistant system.

### Architecture

**Agent Types** (`src/lib/agents/research-agent.ts`):
- **Search Agent**: Specializes in finding relevant papers across databases
- **Analysis Agent**: Analyzes and synthesizes research findings
- **Citation Agent**: Manages citations and formatting
- **Orchestrator Agent**: Coordinates multi-agent responses

**Research Tools** (`src/lib/agents/tools.ts`):
- `searchPapers`: Search academic databases
- `summarizePapers`: Generate comprehensive summaries
- `extractCitations`: Format citations in multiple styles
- `comparePapers`: Compare methodologies and findings
- `findRelatedPapers`: Discover related research

### Environment Setup

Create a `.env.local` file based on `.env.example`:

```bash
OPENAI_API_KEY=your-key-here
# Optional: Custom endpoint
# OPENAI_BASE_URL=https://your-endpoint.com/v1
```

### API Route

The chat API is located at `src/app/api/chat/route.ts`:
- Handles streaming chat responses
- Routes requests to appropriate agents
- Executes tools with Zod validation
- Uses Edge Runtime for optimal performance

### Frontend Integration

The search page (`src/app/search/page.tsx`) uses:
- `useChat` hook from `ai/react` for streaming
- Automatic agent routing based on user intent
- Real-time tool execution visualization
- Markdown rendering for formatted responses

### Extending the Agent System

To add a new agent:

1. Define agent config in `src/lib/agents/research-agent.ts`:
```typescript
export const myAgentConfig: AgentConfig = {
  name: 'My Agent',
  role: 'my-role',
  systemPrompt: '...',
  model: CHAT_MODEL,
  temperature: 0.4,
};
```

2. Add to agents registry:
```typescript
export const agents = {
  // ...existing agents
  myAgent: myAgentConfig,
};
```

3. Update routing logic in `routeToAgent()` if needed

To add a new tool:

1. Define tool in `src/lib/agents/tools.ts`:
```typescript
export const myTool = {
  description: '...',
  parameters: z.object({...}),
  execute: async (params) => {...},
};
```

2. Add to `researchTools` export and `getToolDefinitions()`

3. Update API route to include the new tool

**Data Models** (from `src/app/search/page.tsx`):
```typescript
interface SearchResult {
  id: string;
  title: string;
  journal: string;
  authors: string[];
  publishDate: string;
  summary: string;
  source: 'PubMed' | 'Google Scholar' | 'Embase' | 'bioRxiv' | 'medRxiv';
  url?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

## Build Configuration

**Next.js Config** (`next.config.ts`):
- `output: 'standalone'` - Optimized for container deployment
- Enables Docker deployment with minimal image size

**Docker Support**:
- Multi-stage Dockerfile included for production deployments
- Standalone output allows optimized container builds

## Path Aliases

Configured in `components.json` and available throughout the codebase:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/components/ui` → `src/components/ui`
- `@/hooks` → `src/hooks`
- `@/lib/utils` → `src/lib/utils`

## Styling Notes

- Uses Tailwind CSS v4 with `@theme` syntax (check `tailwind.config.js`)
- Fonts: Geist Sans and Geist Mono (optimized via `next/font/google`)
- CSS variables for theming (defined in `src/app/globals.css`)
- Dark mode support with proper dark: prefixed utilities
- Animations via `tw-animate-css` package

## Working with shadcn/ui Components

When adding new shadcn/ui components, use the CLI:
```bash
npx shadcn@latest add [component-name]
```

The configuration will place components in `src/components/ui/` and automatically apply the project's styling conventions (New York style, neutral base color, CSS variables).
