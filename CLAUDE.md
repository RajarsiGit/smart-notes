# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

No test runner or linter is configured.

## Architecture

Single-page React app with a two-panel layout (sidebar + editor). All state lives in `App.jsx` and is passed down as props — no context or external state management.

**Data flow:**
- `App.jsx` owns `notes[]`, `selectedId`, `searchQuery`, `activeTag`, and `mobileView` state
- Notes are persisted to `localStorage` under the key `smart-notes-v1`
- `filteredNotes` is derived on each render from `notes` + active search/tag filters

**Mobile responsiveness:**
- `mobileView` state (`'list'` | `'editor'`) controls which panel is visible on small screens
- Sidebar hides on mobile when `mobileView === 'editor'`; editor hides when `mobileView === 'list'`
- Breakpoint is `md` (768px) — both panels are always visible at md+

**Styling conventions:**
- All colors are inline Tailwind arbitrary values (e.g. `bg-[#f3f0ea]`) — no theme config
- Custom CSS utilities (`animate-fade-in`, `accent-rule`, `note-textarea`, `note-title-input`) are defined in `src/index.css` under `@layer utilities`
- Fonts: **Syne** (headings, via `font-['Syne']`) and **Manrope** (body/UI, via `font-['Manrope']`), loaded from Google Fonts in `index.html`
