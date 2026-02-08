# Smart Notes

A fast, minimal note-taking app built with React and TailwindCSS. No accounts, no sync, no clutter — just a clean interface for capturing and organizing your thoughts.

Notes are saved automatically to your browser's local storage, so everything persists across sessions without needing a backend.

## Features

- **Create & edit notes** — click the `+` button to start a new note; changes save automatically as you type
- **Tags** — add tags to any note to categorize it; click a tag in the sidebar to filter the list
- **Search** — instantly filter notes by title or content
- **Delete** — remove notes with the delete button in the editor toolbar
- **Mobile friendly** — on small screens, the app switches between a full-screen note list and editor

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Writing a note
Click the **+** button in the top-right of the sidebar to create a new note. Click the title to rename it. The large text area below is where you write.

### Tagging
Below the title in the editor, click **+ Add tag** to attach a tag. Tags you've already used will appear as autocomplete suggestions. Click the `×` on any tag to remove it.

### Searching & filtering
Use the search bar at the top of the sidebar to find notes by title or content. Click any tag pill in the sidebar to filter to notes with that tag. Click it again to clear the filter.

### Mobile
On mobile, the sidebar and editor alternate as full-screen views. Tap a note to open it; use the **← Back** button in the toolbar to return to the list.

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS v3](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) — icons
- [Syne](https://fonts.google.com/specimen/Syne) + [Manrope](https://fonts.google.com/specimen/Manrope) — typography

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
