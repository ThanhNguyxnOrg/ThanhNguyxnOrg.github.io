# ThanhNguyxnOrg website

Official site of ThanhNguyxnOrg, an independent technology practice building developer tools in the open. Static output served at `https://thanhnguyxnorg.github.io`.

## Commands

Requires Node 22+ and npm. All commands run from the repo root:

```bash
npm ci          # install from the lockfile
npm run dev     # local preview
npm run check   # Astro + TypeScript validation, must be clean
npm test        # unit tests (node:test, no framework)
npm run build   # production build into dist/
```

## Data sync

Project numbers are baked at build time, never fetched in browsers. `scripts/sync.ts` pulls the GitHub org, npm registry, and Pages status, then writes `src/data/baked.json`:

```bash
node scripts/sync.ts --out src/data/baked.json
```

`.github/workflows/sync-site.yml` runs this daily at 00:00 UTC (plus manual dispatch), validates with tests and a full build, and commits only on change. Failed runs keep the previous JSON. Traffic/views endpoints need write access, so the site never shows them.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml` (official Astro action), publishing `dist/` to GitHub Pages. Enable Pages with source set to GitHub Actions. No secrets required beyond the automatic `GITHUB_TOKEN`.

## Terms

`GLOSSARY.md` fixes the site vocabulary: Showcase (top 6 by stars), Archive (full 16), Honest metrics (countable numbers only), Baked data (fetched at build time), Snapshot (labeled with fetch date).
