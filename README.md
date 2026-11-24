# Kirubakaran — GitHub Repository Directory

A static Next.js App Router portfolio and searchable directory for all public repositories owned by [@kiruba11k](https://github.com/kiruba11k).

## Live site

https://kiruba11k.github.io/

## Features

An open-world, game-inspired portfolio ("Vice Coast Edition"):

- **Hero:** a procedural sunset coast rendered in a WebGL fragment shader. It shows as an 8×8 Bayer dither or as live ASCII glyphs, and a cursor "flashlight" lights the scene.
- **HUD:** a radar minimap with one blip per chapter, the Bengaluru clock, a GitHub repo "cash" counter and wanted stars that fill as you explore. Each new chapter shows a "checkpoint reached" banner.
- **Floating toolbar** (Radix UI + Lucide): fast travel, a typeface dropdown (Allo · Sans · Serif · Mono · Pixel), a dither/ASCII render toggle and a day/night theme. Choices are saved in localStorage.
- **Chapters:** Player (dithered postage-stamp portrait, segmented skill stats, achievement stamps), Arsenal (keyboard-navigable weapon wheel), Missions (animated ASCII scenes with expandable route briefs), Story (career timeline), Garage (live GitHub repositories with search, language filter and a Radix dialog), and Contact.
- **Keyboard:** `1`–`6` fast travel, `0` top, `/` search, `T` theme, `M` render mode. Respects `prefers-reduced-motion`.

## Stack

- Next.js 14 App Router (static export), React 18 and TypeScript
- WebGL / Canvas 2D for the dither and ASCII renderers
- Radix UI primitives (Dropdown Menu, Toggle Group, Tooltip, Dialog) and Lucide icons
- Hand-written CSS design tokens (no CSS framework)
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