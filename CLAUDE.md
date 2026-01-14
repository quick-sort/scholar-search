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
