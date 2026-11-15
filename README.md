# Kirubakaran — GitHub Repository Directory

A Next.js App Router portfolio and searchable directory for all public repositories owned by [@kiruba11k](https://github.com/kiruba11k).

## Features

- Fetches the complete public repository list from the GitHub REST API (100 repositories per page; paginates until the final page).
- Server-rendered repository data with a one-hour revalidation window.
- Client-side API fallback when the initial GitHub fetch is unavailable.
- Featured repository priority, automatic topic/language categorization, language filters and live search.
- List/grid views, progressive loading, repository detail modal, language breakdown and clone-command copy.
- Responsive sidebar, top domain gallery, keyboard shortcuts (/ and Esc), theme toggle and Surprise me action.

## Stack

- Next.js 14 App Router and React 18
- TypeScript and Tailwind CSS
- Framer Motion and Lucide React
- GitHub REST API

## Run locally

Install dependencies with `npm install`, then run `npm run dev`. Open http://localhost:3000.

## Deploy

This project uses Next.js server rendering, Route Handlers and ISR. Deploy it to a Next.js-capable host such as **Vercel**:

1. Import `kiruba11k/kiruba11k.github.io` into Vercel.
2. Keep the framework preset as Next.js.
3. Use the default build command (`next build`) and output settings.
4. Deploy. No GitHub token is required for public repositories.

### Hosting note

GitHub Pages only serves static assets; it cannot execute Next.js Route Handlers or server-side ISR. The existing GitHub Pages deployment will therefore not run this app's live server features. Use Vercel (or another Node.js Next.js host) for the full experience. The repository API is cached for one hour to reduce GitHub's unauthenticated API usage.

## Repository data

The six pinned projects are declared in `lib/github.ts`. All other repositories are fetched and sorted by most recently pushed. Repository details and language breakdown are fetched on demand and cached.
