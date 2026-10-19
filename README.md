# ThanhNguyxnOrg.github.io

[![Deploy to GitHub Pages](https://github.com/ThanhNguyxnOrg/ThanhNguyxnOrg.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/ThanhNguyxnOrg/ThanhNguyxnOrg.github.io/actions/workflows/deploy.yml)
![Astro](https://img.shields.io/badge/Astro-7-ff5d01?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)

Org site for **ThanhNguyxnOrg** — *Build. Explore. Evolve.*

Live: **https://thanhnguyxnorg.github.io/**

An independent technology practice building developer tools in the open.
Every number on the site is verified data baked from the GitHub API and npm —
no invented claims. Every story is hand-written. One gold accent, dark-first.

## Quickstart

Prerequisite: Node.js 22.

```bash
npm ci
npm run dev      # local dev server
npm test         # 96 tests (~1s)
npm run build    # static build to dist/
npx astro check  # type check
node scripts/check-dist.mjs  # dist hygiene (glyphs, anchors, files, meta)
```

## How it works

```text
GitHub API + npm registry
        │  scripts/sync.ts (daily cron, or manual)
        ▼
src/data/baked.json ──┐  numbers only, never edit by hand
                       ▼
src/content/repos/*.md │  human voice: blurb, story, category, accent, pattern
                       ▼
joinProjects() → sorted stars-first, throws on drift
                       ▼
Astro pages + React islands → dist/ → GitHub Pages
```

- Pages: `/` (hero, metrics, featured, philosophy, journey, explorer, CTA),
  `/projects` (search + filters), `/journey` (full timeline),
  `/about` (principles, migration, live stack, ecosystem), `/404`, `/llms.txt`.
- Design tokens live in one place: `src/styles/tokens.css`.

## Adding content

**New repository** (required — otherwise the next sync breaks the build):

1. Create `src/content/repos/<slug>.md` (see `github.md` for the pattern,
   `slug:` override for special names like `.github`).
2. Add `public/logos/<slug>.png` (max 256px) and `public/brand/<slug>.png`
   (1024x512). `npm run brand:sync` normalizes raster assets automatically;
   `npm run build` runs it too. SVG logos are left untouched.
3. Run `node scripts/sync.ts --out src/data/baked.json`, then test + build.

`npm run brand:check` verifies formats without writing anything (CI uses the
same rules through tests and the sync workflow).

Timeline entries go in `src/content/timeline/*.md`, prose in `src/content/docs/*.md`
— schemas in `src/content.config.ts`.

Repo `topics` on GitHub become the tags shown on cards (max 6) — edit topics
on GitHub, sync pulls them in.

## CI & deploy

- Push to `main` → `deploy.yml`: build + test, then build + deploy to Pages.
  Red tests block the deploy.
- `sync-site.yml`: daily data bake → validate → commit if changed → push,
  which triggers a deploy automatically. Run it manually from the Actions tab.

## License

Open source under the MIT license, matching the rest of the org's projects.
