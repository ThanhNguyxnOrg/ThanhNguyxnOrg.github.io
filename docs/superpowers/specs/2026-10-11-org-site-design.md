# Org Site Design Spec — ThanhNguyxnOrg (thanhnguyxnorg.github.io)

**Date:** 2026-10-11. **Status:** awaiting human review (conversational design approved, spec not yet).
**Stack:** Astro 7.3.8 + TypeScript 6.0.3 strict + React 19.3 islands + Tailwind 4.3.3 + GSAP 3.15 + zod 4.6.5. (TS pinned to 6 because `astro check` officially rejects TS 7; verified live 2026-10-11.)
**Sources:** `docs/research-org-site.md`, `docs/research-top6-history.md`, `GLOSSARY.md`, `design-system/thanhnguyxnorg/MASTER.md` (with overrides below).

## 1. Intent

- **Outcome:** a stranger lands, believes the practice is real within 30 seconds, and opens a repo or live demo. Secondarily, the owner can re-read their own archive.
- **Audience:** technical collaborators and hiring managers who live on GitHub. They skim, distrust marketing copy, and click through to code.
- **Success:** primary CTA (Browse projects) scrolls in-page; demo links get clicked; zero invented numbers anywhere.
- **Non-goals:** blog, newsletter, contact form, light mode, views/clones analytics, corporate mission page.

## 2. Constraints (global, every task inherits these)

- Pure static output. `astro build` → `dist/` → GitHub Pages. No server, no runtime secrets.
- Only honest metrics: 16 repos, 10 stars, 7 forks, 0 open issues, 312 npm downloads/30d, 5 live demos, 8 followers (all verified 2026-10-11; refresh via bake workflow).
- Never link: lumeo demo homepage (dead, verified 404), npm `repository.url` fields (login 404), `awesome-cert-sherpa/practice` subpath (unverified SPA route — link root demo only).
- Copy follows `GLOSSARY.md` terms (Showcase, Archive, Honest metrics, Baked data, Snapshot).
- Site copy is 100% English (`<html lang="en">`). Research notes may stay Vietnamese, but nothing from `docs/research-*` ships to the page without an English rewrite.
- No em-dash anywhere. No Inter. One accent color everywhere. Dark theme locked (night-mode devtool brief; OLED design system marks light not-recommended).
- Reduced motion renders every animated state statically. Keyboard-only completion of browse/filter/open-demo. Touch targets 44px minimum.

## 3. Information architecture (one page, dual audience)

Order top to bottom: Hero (3 lines + proof links + metrics band) → Showcase (6 story cards, demo-first) → Philosophy (3 pillars) → Timeline (6 second-life stops) → Archive (full 16, filterable) → npm shelf (2 packages) → Support (contribute/discuss/issues) → Footer (org, control room, docs, built-with strip).

Wireframe (left-aligned, max width 1120, sections separated by 1px rules):

```
+------------------------------------------------------+
| logo ThanhNguyxnOrg   Projects Stack Journey Support |
+------------------------------------------------------+
| BUILD. EXPLORE. EVOLVE.            | 16 repos 10★   |
| independent practice, 16 repos...  | 313 dl  5 demos |
| [Browse projects]                  | fetched Oct 11  |
+------------------------------------------------------+
| SHOWCASE                                           |
| +============================+ +-----------------+ |
| | blendops (featured, wide)  | | lumeo           | |
| +----------------------------+-----------------+ |
| | apidex-hub | cert-sherpa | PurgeKit | Snapbooth | |
+------------------------------------------------------+
| PHILOSOPHY: Visible growth | Honest archive      |
|             Second life (3 columns, no cards)        |
+------------------------------------------------------+
| JOURNEY (left rail dates, scrub progress line)       |
| 2025-05 o--- Snapbooth scaffold                      |
| 2026-02 o--- cert-sherpa born personal               |
| 2026-04 o--- org founded + migrations                |
| 2026-05 o--- sprint + rewrites                       |
| 2026-10 o--- v2.0.6, site live                       |
+------------------------------------------------------+
| ARCHIVE 16 [filter____] [lang v]  Showing 16 of 16   |
| name ... language ... stars ... repo/demo            |
+------------------------------------------------------+
| PACKAGES: archpulse 0.5.3/146 | backend-kit 1.1.2/167|
+------------------------------------------------------+
| SUPPORT: tiers + [Open an issue]                     |
+------------------------------------------------------+
| org | control room | docs | snapshot | built-with     |
+------------------------------------------------------+
```

## 4. Content (real data, no placeholders)

- **Hero:** H1 "Build. Explore. Evolve." Lede states independent practice + 16 repos. Proof links: blendops, lumeo, org. Metrics band counts up: 16 repos / 10 stars / 312 downloads / 5 demos, each labeled with fetch date.
- **Showcase cards** (each: one-line blurb, story one-liner, language, stars/forks, Demo button where live, repo link):
  1. blendops — skill-pack Blender, org-native sprint 04-05/2026, v0.7.0-draft. No demo.
  2. lumeo — Lumen + Echoly merge, v2.0.6. Repo link only (demo dead).
  3. apidex-hub — dead-link hygiene pipeline. Demo live.
  4. awesome-cert-sherpa — Docusaurus to Vite rewrite, backup tag. Demo live (root only).
  5. PurgeKit — 77 files in one commit, v1.0.0 in a day. No demo.
  6. Snapbooth — SnapStrip 2025 to React Snapbooth, one author. Demo live.
- **Archive:** all 16 rows (name, blurb, language, license, stars, pushed date, repo link, demo link where live). Client filter by text + language, result count, Clear button. Data baked, never fetched in browser.
- **Philosophy 3 pillars** (distilled from `.github/docs/philosophy.md` + `migration.md`): Visible growth / Honest archive / Second life. One line each, link to full docs.
- **Timeline stops:** 2025-05 Snapbooth scaffold → 2026-02 cert-sherpa born personal → 2026-04 org founded + migrations → 2026-04/05 blendops sprint → 2026-05 cert-sherpa rewrite + Snapbooth rebuild → 2026-10 v2.0.6 lumeo, site live. Thin-history repos (apidex-hub, PurgeKit) appear without invented past.
- **npm shelf:** archpulse@0.5.3/146 + production-backend-kit@1.1.2/167, keywords, no repo links.
- **Support:** best-effort tiers (Active: blendops, lumeo, apidex-hub, SkillGauge; Maintained: PurgeKit, Locsight, cogmint, ForgeHelm), three links: open issue, support tiers, contributing guide.
- **Footer:** Organization, Control room (.github), projects doc, stack doc, snapshot date, "Built with Astro + React + TS" with pinned versions, site repo link.

## 5. Data flow (baked data)

- `.github/workflows/sync-site.yml`, cron daily 00:00 UTC, `GITHUB_TOKEN`:
  1. `GET /orgs/ThanhNguyxnOrg` + `/orgs/ThanhNguyxnOrg/repos?per_page=100` (2 req).
  2. Per repo: `/languages` (16), `/releases?per_page=1` (16). Skip on 403/404, record `unverified` flag per field.
  3. npm registry + downloads API for both packages (4 req, no quota issue).
  4. HEAD-check the 5 demo URLs + lumeo (6 req, expect lumeo 404; if any demo flips status, keep old value and flag in commit message).
  5. Write `src/data/baked.json` `{fetched_at, totals, repos[16], npm[2]}` and commit. Total GitHub reqs ≈ 34, inside 1000/h token quota.
- Failure keeps previous `baked.json`; workflow fails loudly in Actions log only. Page always labels the fetch date.
- Content collections: `src/content/repos/*.md` (16, hand-written blurbs + story lines, zod schema requires name/repoUrl/language/blurb), `src/content/timeline/*.md` (6 stops). Schema violation fails the build.

## 6. Components (each one responsibility, typed props)

- `Layout.astro`: head, fonts, nav, footer, skip link. Props: title, description. Composes `SiteHeader` island (`client:load`) + static `SiteFooterBlock`; all JSX props constructed in `SiteChrome.tsx` (Astro cannot pass its JSX as props to islands).
- `sections/Hero.tsx` (constellation keeps SVG geometry, core mark is the real logo, dots strip replaced by metrics band) + `MetricsBand.tsx` island (animated counters, `client:visible`): props totals + fetched_at.
- `sections/Featured.tsx` (Lead/Poster/Strip kept): props 6 real records with story lines; demo button only where live-verified.
- `sections/Explorer.tsx` island (`client:visible`): search + category + tags + sort over real 16, result count, reset. No URL state (YAGNI; deep-link later if asked).
- `sections/Philosophy.tsx` rewritten to org truth (Build/Explore/Evolve/Second life); `sections/Ecosystem.tsx` (org + 2 npm packages + control room); `sections/Journey.tsx` (Timeline, 6 dated stops); `CTA.tsx` (no eyebrow, no gradient word).
- Primitives in `src/components/*` (Button, Badge, Container, TextLink, IconButton, BrandIcons, ProjectGlyph, Logo, SearchField, FilterGroup, States, Content, SiteNav, SiteFooter, ProjectCard, FeaturedProject) + `src/motion/*` (tokens, Reveal). Lucide only; no phosphor/three/lenis/motion packages.
- `src/lib/baked.ts`: zod schemas + typed loaders. `src/lib/format.ts`: star/download/date formatters.

## 7. Visual system (MASTER.md overrides recorded here)

- Tokens (frame incumbent wins over pre-frame values): bg `#080b14`, surface `#0e1220`, raised `#151a2b`, border `#1f2537` visible structural, text `#f4f5fa`, muted `#a3a9bf`, subtle `#868ca6`. Gold family: bright `#f59e0b` (text accents), soft `#fcd34d` (emphasis text), deep `#a16207` (fills, white text 4.92:1), ink `#854d0e` (fill hover). Neutral stone `#e7e5e4` for secondary actions. All 9 text pairs measured AA 2026-10-11 (weakest 4.92:1).
- Shape: sharp corners (0-4px), cards flat with 1px borders, pills only for small badges/inputs. Left-aligned throughout.
- Type: display Space Grotesk 500-700 (geometric grotesk, devtool-native, vietnamese subset kept for future VI copy; chosen over Palanquin Dark and Familjen Grotesk via ui-ux-pro-max google-fonts domain), body Inter 400-700 (frame incumbent; Plex Sans dropped to avoid churning every component), data JetBrains Mono 400-700 for code and numbers only, never body copy. Scale: display `clamp(2.75rem, 7vw, 5.5rem)` tight leading, H2 1.75rem, body 16px/1.6, data 13-14px. Three roles, never mixed for emphasis.
- Icons: Phosphor Icons, one family everywhere, regular weight, consistent stroke; static Astro parts inline the same paths. No emoji as icons. (Explicit fallback: ui-ux-pro-max icons domain returned 0 results on two queries, so the taste-skill built-in default applies.)
- No eyebrow kickers above headings, no numbered section labels. Exception: timeline stops carry real dates, a true sequence, so date markers there encode information.
- Logo TNX mark in nav (44px) + footer; favicon from cropped mark; `public/og-image.png` 1200x630 static card derived from logo for link previews.

## 8. Motion (GSAP, motivated only)

- Load orchestration once: hero lines stagger up + metrics count up (1.2s total, expo.out).
- Scroll reveals batched per section: y offset 8-16px only (fade, not slide), 300-500ms, power1/power2.out, `toggleActions: 'play none none reverse'`, stagger max 8 children, trigger scoped to the section container (per ui-ux-pro-max gsap presets). Timeline progress line uses non-pinned scrub; nothing on this page pins (pinning max 1-2 per page per preset guidance, we use zero to protect mobile scroll feel).
- `ScrollTrigger.refresh()` after fonts and images load. React islands use `useGSAP()` with container scope for auto-cleanup. Markers off in production. Static HTML already carries all content, so reveals never hide anything from crawlers or no-JS.
- Card spotlight follows pointer (CSS vars, no JS animation loop). Counters animate on first visibility.
- Disabled entirely under `prefers-reduced-motion` (final states rendered). No custom cursor, no scroll hijack, no marquee (topics strip static).

## 9. Error handling and edge cases

- API failure mid-workflow: keep old JSON, fail the workflow run visibly, page unchanged except date label stays old.
- Filter zero hits: inline message + Clear button, focus stays in input, count reads "Showing 0 of 16".
- No-JS: everything server-rendered; filter island degrades to full static list (island markup includes full list server-side).
- Missing demo: card shows repo link only, no disabled demo button.
- Images (logo, skillicons) have `onerror` hide + alt text; skillicons strip lazy-loads.

## 10. Acceptance testing

- `astro check` clean, `npm run build` clean, `impeccable detect --json dist/index.html` exit 0.
- Contrast AA on all text (gold-on-dark restricted by §7), keyboard walkthrough of filter + demos, layouts at 375/768/1024/1440 with screenshots, link checker over `dist/` (zero 404s internal; external demo links verified 200 at bake time).
- Lighthouse: performance 90+ on desktop (islands `client:visible`, fonts display=swap, images sized).
