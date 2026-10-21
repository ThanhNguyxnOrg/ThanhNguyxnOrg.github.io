# ThanhNguyxnOrg.github.io

[![Sync telemetry and deploy](https://github.com/ThanhNguyxnOrg/ThanhNguyxnOrg.github.io/actions/workflows/sync-org-data.yml/badge.svg)](https://github.com/ThanhNguyxnOrg/ThanhNguyxnOrg.github.io/actions/workflows/sync-org-data.yml)

Org site for **ThanhNguyxnOrg** · *Build. Explore. Evolve.*

Live: **https://thanhnguyxnorg.github.io/**

An independent technology practice building developer tools, AI workflows, and open-source utilities. The site is an interactive 3D showcase and engineering index. Repository counts, stars, forks, languages, demos, and npm downloads are baked from the GitHub API and npm Registry, then refreshed live in the browser.

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS 4
- Three.js orbital scene
- Motion + Lucide icons
- Node test runner via `tsx`

## Quickstart

Requires Node.js 22.

```bash
npm ci
npm run dev       # http://localhost:3000
npm test          # logic + data integrity tests
npm run lint      # TypeScript check
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Sync

```bash
npm run sync      # bake GitHub + npm telemetry into src/data/liveSnapshot.json
npm run brand:sync   # normalize logo/theme assets
npm run brand:check  # verify assets without writing
```

`npm run sync` reads `GITHUB_TOKEN` when available for a higher GitHub API rate limit. The tracked snapshot is committed by the workflow, so the site still renders verified data when the APIs are unavailable.

The `Sync telemetry and deploy` workflow runs every 6 hours, on pushes to `main`, and on `repository_dispatch`. It normalizes assets, bakes fresh telemetry, runs tests and type-checking, commits any snapshot/asset changes, builds, and deploys to GitHub Pages.

## Brand assets

- `public/logos/<slug>.png|svg` — repository logos, raster max 256px.
- `public/brand/<slug>.png` — repository themes, exactly 1024x512.
- `public/logo.png` — org logo.
- `public/og-image.png` — social preview, 1200x630.

`npm run brand:sync` keeps raster assets within those budgets. SVG logos are left untouched.

## Layout

```text
index.html
src/
  App.tsx
  components/       # hero, 3D scene, featured, journey, archive, modal
  data/             # curated org data + baked live snapshot
  utils/            # live sync, project logic, tests
public/             # logos, themes, icons, social preview
scripts/
  bake-org-data.mjs # GitHub + npm telemetry baker
  brand.mjs         # asset normalizer
```
