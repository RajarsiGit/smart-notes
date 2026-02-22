# Smart Notes

A fast, minimal note-taking app built with React, TailwindCSS, and a PostgreSQL backend. Sign in to create, organize, and access your notes from anywhere.

## Features

- **Accounts** — register and sign in; notes are stored per-user in a cloud database
- **Create & edit notes** — click `+` to start a new note; changes save automatically as you type
- **Tags** — add tags to any note to categorize it; click a tag in the sidebar to filter the list
- **Search** — instantly filter notes by title or content
- **Delete** — remove notes with the delete button in the editor toolbar
- **Resizable sidebar** — drag the right edge of the sidebar to adjust its width
- **Collapsible sidebar** — collapse the sidebar to an icon strip to maximize editor space
- **Mobile friendly** — on small screens, the app switches between a full-screen note list and editor

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)
- A [Neon](https://neon.tech/) PostgreSQL database

### Setup

```bash
npm install
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env
vercel dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Writing a note
Click the **+** button in the sidebar to create a new note. Click the title to rename it. The text area below is where you write — changes are saved automatically.

### Tagging
Below the title in the editor, click **+ Add tag** to attach a tag. Tags you've already used appear as autocomplete suggestions. Click `×` on any tag to remove it.

### Searching & filtering
Use the search bar at the top of the sidebar to find notes by title or content. Click any tag pill in the sidebar to filter to notes with that tag; click it again to clear.

### Sidebar
- **Resize** — drag the right edge to make the sidebar wider or narrower (desktop only)
- **Collapse** — click the chevron button to collapse the sidebar to a narrow icon strip; click again to expand

### Mobile
On mobile, the sidebar and editor alternate as full-screen views. Tap a note to open it; use the **← Back** button in the toolbar to return to the list.

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS v3](https://tailwindcss.com/)
- [Neon](https://neon.tech/) — serverless PostgreSQL
- [Vercel](https://vercel.com/) — hosting + serverless functions
- [Lucide React](https://lucide.dev/) — icons
- [Syne](https://fonts.google.com/specimen/Syne) + [Manrope](https://fonts.google.com/specimen/Manrope) — typography

## Scripts

| Command | Description |
|---|---|
| `vercel dev` | Start dev server with API support |
| `npm run dev` | Start frontend only (no API) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
