# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
vercel dev        # Start dev server with API support (preferred)
npm run dev       # Start frontend only (no API) at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

No test runner or linter is configured.

## Architecture

Single-page React app with a two-panel layout (sidebar + editor). Global state (user, notes) lives in `AppContext`; local UI state lives in `App.jsx`.

**Data flow:**
- `src/context/AppContext.jsx` owns `user`, `notes`, `loading`; exposes `createNote`, `updateNote`, `deleteNote`, `logout`
- `App.jsx` owns `selectedId`, `searchQuery`, `activeTag`, `mobileView`, `collapsed`
- Notes are persisted to **Neon PostgreSQL** via Vercel serverless functions — no localStorage
- `filteredNotes` is derived on each render from `notes` + active search/tag filters
- `updateNote` is debounced 800ms (single `useRef` timer — one note edited at a time)

**Backend:**
- `api/auth.js` — register / login / logout / me (JWT, httpOnly cookie, 1h expiry)
- `api/notes.js` — CRUD, maps snake_case → camelCase
- `api/db.js` — `getDb()`, `getUserFromRequest()`
- `src/utils/api.js` — `authApi` + `notesApi` helpers (`credentials: 'include'`)
- `vercel.json` — rewrites for auth sub-routes + SPA fallback

**Mobile responsiveness:**
- `mobileView` state (`'list'` | `'editor'`) controls which panel is visible on small screens
- Sidebar hides on mobile when `mobileView === 'editor'`; editor hides when `mobileView === 'list'`
- Breakpoint is `md` (768px) — both panels are always visible at md+

**Sidebar:**
- Collapsible via chevron button (`collapsed` state in `App.jsx`) — collapses to `w-12` icon strip
- Drag-to-resize on desktop: width managed as local state inside `Sidebar.jsx` (min 180px, max 480px, default 288px)
- Drag handle is an 8px hit zone at the right edge, hidden on mobile; transition disabled during drag
- Footer shows signed-in user's **name** (not email) + sign out button

**Styling conventions:**
- All colors are inline Tailwind arbitrary values (e.g. `bg-[#f3f0ea]`, accent `#0d9488`) — no theme config
- Custom CSS utilities (`animate-fade-in`, `accent-rule`, `note-textarea`, `note-title-input`) are defined in `src/index.css` under `@layer utilities`
- Fonts: **Syne** (headings, via `font-['Syne']`) and **Manrope** (body/UI, via `font-['Manrope']`), loaded from Google Fonts in `index.html`
- `__APP_VERSION__` is injected at build time from `package.json` via `vite.config.js`

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root — wraps with `<AppProvider>`, shows `<AuthScreen>` or main layout |
| `src/context/AppContext.jsx` | User/notes state, CRUD, debounced updateNote |
| `src/utils/api.js` | `authApi` + `notesApi` fetch helpers |
| `src/components/AuthScreen.jsx` | Login/register form |
| `src/components/Sidebar.jsx` | Note list, search, tag filter, collapse + drag-to-resize |
| `src/components/NoteEditor.jsx` | Editor panel |
| `api/auth.js` | Auth serverless routes |
| `api/notes.js` | Notes CRUD serverless routes |
| `api/db.js` | DB connection + JWT helpers |

## DB Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'Untitled',
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment

Copy `.env.example` → `.env` and fill:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `JWT_SECRET` — secret for signing JWTs
