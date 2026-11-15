# Kirubakaran — GitHub Repository Directory

A static Next.js App Router portfolio and searchable directory for all public repositories owned by [@kiruba11k](https://github.com/kiruba11k).

## Live site

https://kiruba11k.github.io/

## Features

- Browser-side GitHub REST API fetching with pagination (100 repositories per page, up to 1,000).
- Six featured repositories pinned above the chronological repository list.
- Automatic categorization using repository name, description, topics and primary language.
- Sidebar filters, language tabs, instant search and keyboard shortcuts (/ and Esc).
- List/grid views, progressive loading, repository details, language breakdown and clone-command copy.
- Responsive design, curved domain showcase, dark/light theme and Surprise me action.

## Stack

- Next.js 14 App Router, React 18 and TypeScript
- Tailwind CSS, Framer Motion and Lucide React
- GitHub REST API (public endpoints; no token required)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## GitHub Pages deployment

This repository is configured for **Next.js static export**. Repository data is fetched directly from GitHub in the browser, because GitHub Pages does not run Next.js servers, Route Handlers or ISR.

One-time setup in GitHub:

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Save. The workflow in `.github/workflows/nextjs-build.yml` builds the `out/` directory and deploys it to GitHub Pages on every push to `main`.

The live address remains https://kiruba11k.github.io/.

## API considerations

The site uses GitHub's unauthenticated public API. It requests repository pages sequentially and stops when a page contains fewer than 100 items. Browser requests are subject to GitHub's public rate limits; the UI provides a retry message if the limit is reached.