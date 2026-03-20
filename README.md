# TabVault

Minimalist tab manager for saving and organizing browser tabs.
A replacement for the chaotic `.txt` file on your desktop.

## The Problem

20–40 open tabs create cognitive overload. You copy URLs into a text file, lose track, repeat.
TabVault gives structure to that workflow — paste links, categorize, find them later.

## Features

- **Quick import** — paste multiple URLs at once, auto-extracts domains and favicons
- **Categories** — organize tabs with color-coded tags (not folders)
- **Search** — instant filtering by domain, title, or URL
- **Drag & drop** — reorder tabs within categories
- **Keyboard-first** — `Cmd/Ctrl+V` to import, arrow keys to navigate, Enter to open
- **Bulk actions** — select multiple tabs, move or delete at once
- **Export** — JSON, Markdown, or HTML Bookmarks
- **Cloud sync** — Supabase auth + real-time persistence across devices

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19, TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4, Manrope font |
| State | Zustand (persist middleware) |
| Animation | GSAP |
| Drag & Drop | dnd-kit |
| Backend | Supabase (auth + PostgreSQL) |
| Deploy | GitHub Pages |

## Architecture

Feature-based structure with centralized Zustand store:

```
src/
├── features/
│   ├── tabs/          # Tab list, import modal, tab item
│   ├── categories/    # Category pills, add/edit modals
│   ├── search/        # Instant search with debounce
│   ├── auth/          # Supabase auth, sync hook
│   └── export/        # JSON / Markdown / HTML export
├── shared/            # Reusable components, hooks, utils
├── store/             # Zustand store with persist
├── App.tsx
└── main.tsx
```

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Deploy to GitHub Pages
bun run deploy
```

## Design Philosophy

Inspired by Dieter Rams, Jony Ive, and Bauhaus principles:

- Function over decoration
- Minimal visual noise, maximum whitespace
- No decorative gradients or shadows
- Every UI element exists only if it solves a problem

## License

MIT
