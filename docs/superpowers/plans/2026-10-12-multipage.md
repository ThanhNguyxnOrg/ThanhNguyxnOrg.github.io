# Multi-page Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the one-page site into `/`, `/projects`, `/journey`, `/about` plus 404, reusing existing sections.

**Architecture:** Extract shared data loading into `src/lib/site-data.ts`; pages are thin Astro files composing existing islands; Explorer/Journey gain optional teaser props; docs vendored once into `src/content/docs/`.

**Tech Stack:** Astro 7 static, React islands, Tailwind v4, node:test, zod.

**Spec:** `docs/superpowers/specs/2026-10-12-multipage-design.md`

## Global Constraints
- Same tokens, same reduced-motion guards, no new motion.
- `npm test`, `npm run build`, `npx astro check` green every task.
- Static output only; no SSR.
- Anchor nav items (`#support`, `#packages`) must become page paths (`/#support`) wherever they appear off-home.

## Review Focus
- Off-home anchor links pointing at `#id` without a page path break scrolling — every nav/footer/CTA link gets a route test in Task 6.
- Mobile menu must navigate to pages, not dead anchors — covered by the same route test.
- Vendored docs drifting from upstream `.github` copies — `origin:` frontmatter on each file records the source; no auto-sync by design.
- Home teasers showing stale slices — teaser props derive from the same `projects`/`stops` arrays, asserted in Tasks 3–4.
- 404 page referencing missing assets — Task 6 asserts dist output contains it.

---

### Task 1: Shared site data

**Files:**
- Create: `src/lib/site-data.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/site-data.test.ts`

**Interfaces:**
- Consumes: `loadBaked` (`src/lib/baked.ts`), `joinProjects` (`src/lib/projects.ts`), `getCollection` (astro:content).
- Produces: `loadSiteData(): Promise<{ baked, projects, stops, resources }>` with the exact shapes index.astro uses today.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
describe("site data", () => {
  it("loads 16 projects sorted stars-first", async () => {
    const { loadSiteData } = await import("../src/lib/site-data.ts");
    const { projects } = await loadSiteData();
    assert.equal(projects.length, 16);
    assert.ok(projects[0].stars >= projects[15].stars);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site-data.test.ts`
Expected: FAIL with "function not defined" (module missing).

- [ ] **Step 3: Implement `loadSiteData` in `src/lib/site-data.ts`**

Move the exact data-loading block out of `src/pages/index.astro` (baked load, repoEntries join, stops sort, resources array); index.astro calls it. No visual change.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/site-data.test.ts && npm run build`
Expected: PASS, build green, identical HTML.

- [ ] **Step 5: Commit**

```bash
git add src/lib/site-data.ts src/pages/index.astro tests/site-data.test.ts
git commit -m "feat: shared site data loader"
```

### Task 2: Page-aware nav and footer

**Files:**
- Modify: `src/layouts/Layout.astro`, `src/components/SiteNav.tsx` (only if props missing), `src/components/SiteFooter.tsx`
- Test: `tests/routes.test.ts` (grown in Task 6; this task asserts nav items)

**Interfaces:**
- Consumes: nothing new.
- Produces: `Layout` props `{ title, description, currentPath }`; nav items `[{label Projects href /projects}, {Journey /journey}, {About /about}, {Support /#support}]`; footer sitemap mirrors them.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
describe("nav", () => {
  it("links pages, never bare anchors", () => {
    const layout = readFileSync("src/layouts/Layout.astro", "utf-8");
    for (const href of ["/projects", "/journey", "/about", "/#support"]) assert.ok(layout.includes(href));
    assert.ok(!layout.includes("href=\"#projects\""));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/routes.test.ts`
Expected: FAIL (anchors still bare).

- [ ] **Step 3: Implement nav/footer links in `src/layouts/Layout.astro` + `src/components/SiteFooter.tsx`**

Pass `currentPath` through to `SiteHeader`/`SiteNav` for `currentHref`; footer columns gain About/Journey/Projects page links.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/routes.test.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/components/SiteFooter.tsx tests/routes.test.ts
git commit -m "feat: page-aware nav and footer"
```

### Task 3: Projects page plus home teaser

**Files:**
- Modify: `src/sections/Explorer.tsx`, `src/pages/index.astro`
- Create: `src/pages/projects.astro`
- Test: `tests/routes.test.ts` (append)

**Interfaces:**
- Consumes: `loadSiteData()`, `FullProject[]`.
- Produces: `Explorer` props `{ projects, limit?, previewHref? }`; when `limit` is set the filters UI is hidden and the list slices to `limit` with a "Browse all N projects" link.

- [ ] **Step 1: Write the failing test**

```ts
describe("projects page", () => {
  it("renders full index on /projects and teaser on home", async () => {
    const { readFileSync } = await import("node:fs");
    assert.ok(readFileSync("src/pages/projects.astro", "utf-8").includes("<Explorer"));
    assert.ok(readFileSync("src/sections/Explorer.tsx", "utf-8").includes("previewHref"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/routes.test.ts`
Expected: FAIL (no projects.astro).

- [ ] **Step 3: Implement `src/pages/projects.astro` (full Explorer + CTA) and the `limit`/`previewHref` props in `src/sections/Explorer.tsx`; home passes `limit={4} previewHref="/projects"`**

Teaser shows 4 most-recently-pushed projects.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/routes.test.ts && npm run build`
Expected: PASS, `dist/projects/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects.astro src/pages/index.astro src/sections/Explorer.tsx tests/routes.test.ts
git commit -m "feat: projects page and home teaser"
```

### Task 4: Journey page plus home teaser

**Files:**
- Modify: `src/sections/Journey.tsx`, `src/pages/index.astro`
- Create: `src/pages/journey.astro`
- Test: `tests/routes.test.ts` (append)

**Interfaces:**
- Consumes: `loadSiteData()`, `JourneyStop[]`, `FullProject[]`.
- Produces: `Journey` props `{ stops, repoCount, foundedAt, projects, limit? }`; when `limit` is set only the first `limit` stops render plus a "Full journey" link to `/journey`.

- [ ] **Step 1: Write the failing test**

```ts
describe("journey page", () => {
  it("renders full timeline on /journey and teaser on home", async () => {
    const { readFileSync } = await import("node:fs");
    assert.ok(readFileSync("src/pages/journey.astro", "utf-8").includes("<Journey"));
    assert.ok(readFileSync("src/sections/Journey.tsx", "utf-8").includes("limit"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/routes.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/pages/journey.astro` (full Journey + sticky panel + CTA) and the `limit` prop; home passes `limit={3}`**

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/routes.test.ts && npm run build`
Expected: PASS, `dist/journey/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add src/pages/journey.astro src/pages/index.astro src/sections/Journey.tsx tests/routes.test.ts
git commit -m "feat: journey page and home teaser"
```

### Task 5: About page with vendored docs

**Files:**
- Create: `src/content/docs/philosophy.md`, `src/content/docs/migration.md`, `src/content/docs/stack.md` (copies with `origin:` frontmatter), `src/pages/about.astro`
- Modify: `src/content.config.ts` (docs collection), `src/styles/tokens.css` (prose rules)
- Test: `tests/routes.test.ts` (append)

**Interfaces:**
- Consumes: `loadSiteData()` for live stack numbers + `EcoResource[]`; docs collection entries.
- Produces: `/about` rendering Philosophy section + migration prose + live stack stats + Ecosystem rows + CTA.

- [ ] **Step 1: Write the failing test**

```ts
describe("about page", () => {
  it("renders vendored docs with live numbers", async () => {
    const { readFileSync } = await import("node:fs");
    assert.ok(readFileSync("src/pages/about.astro", "utf-8").includes("Ecosystem"));
    for (const f of ["philosophy.md", "migration.md", "stack.md"]) {
      const text = readFileSync(`src/content/docs/${f}`, "utf-8");
      assert.ok(text.includes("origin:"), `${f} records upstream`);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/routes.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement vendor copies (philosophy/migration/stack bodies, origin noted, capsule-render badges dropped), `src/pages/about.astro`, prose CSS, and move the Ecosystem section off home**

Stack numbers come from `baked.totals`/`languages`, never copied.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/routes.test.ts && npm run build`
Expected: PASS, `dist/about/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add src/content/docs src/pages/about.astro src/pages/index.astro src/content.config.ts src/styles/tokens.css tests/routes.test.ts
git commit -m "feat: about page with vendored docs"
```

### Task 6: 404, llms.txt, route audit

**Files:**
- Create: `src/pages/404.astro`
- Modify: `src/pages/llms.txt.ts`, `tests/routes.test.ts`
- Test: `tests/routes.test.ts`

**Interfaces:**
- Consumes: nav/footer hrefs, dist output.
- Produces: every internal href in nav/footer/CTA resolves to a built file; llms.txt lists all four pages.

- [ ] **Step 1: Write the failing test**

```ts
describe("routes", () => {
  it("every internal link resolves to a built page", async () => {
    const { readFileSync, existsSync } = await import("node:fs");
    const dist = (p: string) => existsSync(`dist/${p}`);
    for (const p of ["index.html", "projects/index.html", "journey/index.html", "about/index.html", "404.html"]) assert.ok(dist(p), p);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/routes.test.ts`
Expected: FAIL (404.html missing at minimum).

- [ ] **Step 3: Implement `src/pages/404.astro` (on-brand, links home/projects) and per-page `llms.txt.ts` entries**

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/routes.test.ts && npm test && npx astro check`
Expected: full suite green, 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/404.astro src/pages/llms.txt.ts tests/routes.test.ts
git commit -m "feat: 404 page and route audit"
```
