# ASR Data

Offline-first speech transcription app built with Next.js, React, and Transformers.js.

The app records audio in the browser, runs transcription locally through a web worker, and stores recordings/transcripts in IndexedDB (Dexie).

## Features

- Auto transcription flow with microphone recording and one-click transcription.
- Manual transcription flow for editing/saving transcript text manually.
- Recording detail page with:
- Transcript editing and save-state feedback.
- Pin/unpin support.
- Sync status controls (`pending`, `synced`, `failed`).
- Keyboard save shortcut (`Ctrl+S` / `Cmd+S`).
- Sidebar navigation with:
- Collapse/expand behavior.
- Search recordings.
- Status counters.
- Pinned recordings surfaced first.
- Offline-friendly local persistence using Dexie + IndexedDB.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Dexie (IndexedDB)
- Transformers.js (`@xenova/transformers`)
- Web Workers
- Lucide React icons

## Project Structure

- `src/app`: Next.js routes and layouts
- `src/components`: UI and feature components
- `src/hooks`: recorder/transcriber/recordings hooks
- `src/lib/db`: Dexie database schema
- `src/lib/worker`: worker logic for model inference
- `src/providers`: app-level context providers

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run development server

```bash
pnpm dev
```

### 3. Open app

Visit `http://localhost:3000`.

## Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint

## Data & Persistence

- Recordings are stored locally in IndexedDB database: `AudioTranscriptionDB`.
- Recordings include metadata such as label, transcript, sync status, and pin state.
- Pinned recordings are sorted ahead of non-pinned recordings.

## Notes

- Microphone permission is required for recording.
- Most features are designed for modern Chromium-based browsers.
- If IndexedDB schema upgrades fail after local schema changes, clear the `AudioTranscriptionDB` database in browser DevTools and reload.

## Linting

Run:

```bash
pnpm lint
```
