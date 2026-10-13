# Showcase FX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai Hero B canvas wow + full 3 phase FX mà vẫn giữ contrast, reduced-motion tĩnh, build xanh.

**Architecture:** Astro render tĩnh số cuối trước; React islands enhance khi `no-preference` + `pointer fine`. CSS tĩnh trong `tokens.css`, JS rAF/IO/ScrollTrigger mỗi effect tự cleanup.

**Tech Stack:** Astro 7, React 19, Tailwind v4, GSAP 3 + ScrollTrigger, node:test, zod.

**Spec:** `docs/superpowers/specs/2026-10-11-showcase-fx-design.md`

## Global Constraints
- Nền `#080b14`, gold `#f59e0b`/`#fcd34d`, không đổi palette.
- Text 4.5:1, large-text 3:1, non-text/UI 3:1.
- `reduce` → tĩnh hết; tokens kill-switch trong `src/styles/tokens.css` giữ nguyên.
- Hit-area ≥24px, khuyến nghị 44px; giữ focus-visible gold.
- Marquee ≤1, tilt ≤1 card, moving-border động ≤1 CTA, glow ≤2 section, lamp ≤2 header, noise 1 layer.
- `npm test` + `npm run build` + `astro check` xanh mỗi task.

## Review Focus
- Canvas mount khi tab nền: rAF phải pause, không đốt CPU — mong đợi CPU idle ~0 khi tab ẩn.
- Marquee screen reader đọc 1 lần — mong đợi bản duplicate có `aria-hidden`.
- Count-up với JS tắt vẫn hiện số cuối — mong đợi SSR số thật.
- Tilt/glow trên touch không kẹt hover — mong đợi `pointer coarse` render tĩnh.
- Timeline scrub cuộn lên vẽ lui đúng — mong đợi progress bám scroll, `reduce` hiện spine đầy.

---

### Task 1: Hero static fix + CSS rẻ

**Files:**
- Modify: `src/sections/Hero.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/pages/index.astro` (scroll-mt cho section anchor nếu thiếu)
- Test: `tests/visual-static.test.ts`

**Interfaces:**
- Consumes: `MOTION_OK_QUERY` từ `src/motion/tokens.ts`, `baked.totals`, `projects slice(0,5)`.
- Produces: class `.text-gradient-gold`, `.tabular`, `scroll-mt` đúng, label không cắt ở 375px.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
describe("visual static", () => {
  it("has gold gradient token and tabular-nums", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("text-gradient-gold"));
    assert.ok(css.includes("tabular-nums"));
  });
  it("hero constellation allows overflow visible", () => {
    const hero = readFileSync("src/sections/Hero.tsx", "utf-8");
    assert.ok(hero.includes("overflow-visible"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/visual-static.test.ts`
Expected: FAIL (token chưa có).

- [ ] **Step 3: Implement CSS + Hero fix trong `src/styles/tokens.css` và `src/sections/Hero.tsx`**

Thêm `.text-gradient-gold` (`linear-gradient(90deg,#fcd34d,#f59e0b)`, `bg-clip:text`), `.tabular { font-variant-numeric: tabular-nums }`, giữ `bg-aurora/blueprint`. Hero: headline `Evolve.` dùng gradient, star count `tabular`, container `min-w-0` + svg `overflow-visible`, mở rộng padding phải để hết cắt BLENDOPS/AWES.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/visual-static.test.ts && npm run build`
Expected: PASS + build xanh.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Hero.tsx src/styles/tokens.css tests/visual-static.test.ts
git commit -m "feat: hero static fix gradient tabular overflow"
```

### Task 2: StarCanvas + vệt băng

**Files:**
- Create: `src/components/StarCanvas.tsx`
- Modify: `src/sections/Hero.tsx`
- Test: `tests/star-canvas.test.ts`

**Interfaces:**
- Consumes: `prefersReducedMotion()` từ `src/motion/tokens.ts`.
- Produces: `<StarCanvas density={150} />` — canvas fixed trong hero, `shouldEnhance(): boolean`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
describe("star canvas guard", () => {
  it("does not enhance on reduce or small screen", async () => {
    const mod = await import("../src/components/StarCanvas.tsx");
    assert.equal(mod.shouldEnhance(true, 800), false);
    assert.equal(mod.shouldEnhance(false, 360), false);
    assert.equal(mod.shouldEnhance(false, 1024), true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/star-canvas.test.ts`
Expected: FAIL (file chưa có).

- [ ] **Step 3: Implement `shouldEnhance(reduced: boolean, width: number): boolean` + `StarCanvas` trong `src/components/StarCanvas.tsx`**

Canvas 2D `alpha:false`, DPR scale, 150 sao sin-opacity, 1 sao băng `shadowBlur` duy nhất, rAF dừng khi tab ẩn / unmount. Chỉ mount khi `!reduced && width>=768`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/star-canvas.test.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StarCanvas.tsx src/sections/Hero.tsx tests/star-canvas.test.ts
git commit -m "feat: hero canvas starfield capped"
```

### Task 3: ScrollProgress + Noise

**Files:**
- Create: `src/components/ScrollProgress.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/layouts/Layout.astro`
- Test: `tests/chrome-fx.test.ts`

**Interfaces:**
- Consumes: ScrollTrigger `onUpdate self.progress`.
- Produces: `<ScrollProgress />` fixed 2px gold + `.noise-overlay` 1 layer.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
describe("chrome fx", () => {
  it("has noise overlay token", () => {
    assert.ok(readFileSync("src/styles/tokens.css", "utf-8").includes("noise-overlay"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/chrome-fx.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `ScrollProgress` + `.noise-overlay`**

Thanh `transform: scaleX(progress)`, `aria-hidden`, `reduce` → ẩn. Noise `position:fixed inset:0 opacity:.06 pointer-events:none` SVG feTurbulence inline.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/chrome-fx.test.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrollProgress.tsx src/styles/tokens.css src/layouts/Layout.astro tests/chrome-fx.test.ts
git commit -m "feat: scroll progress and noise"
```

### Task 4: CountUp + Marquee

**Files:**
- Create: `src/components/CountUp.tsx`
- Create: `src/sections/TechMarquee.tsx`
- Modify: `src/sections/MetricsBand.tsx`
- Test: `tests/numbers.test.ts`

**Interfaces:**
- Consumes: `baked.totals` số cuối SSR.
- Produces: `<CountUp value={10} />`, `<TechMarquee items={[...]} />`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
describe("numbers", () => {
  it("marquee duplicates aria-hidden", async () => {
    const src = (await import("node:fs")).readFileSync("src/sections/TechMarquee.tsx", "utf-8");
    assert.ok(src.includes('aria-hidden="true"'));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/numbers.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `CountUp` (IO 0.4 → rAF 1200ms ease-out, `toLocaleString en-US`) và `TechMarquee` (`scroll 40-60s`, hover pause, `reduce` → grid tĩnh)**

SSR luôn số cuối; JS chỉ animate khi `no-preference`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/numbers.test.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/CountUp.tsx src/sections/TechMarquee.tsx src/sections/MetricsBand.tsx tests/numbers.test.ts
git commit -m "feat: count-up and marquee"
```

### Task 5: Border + Tilt + Glow + Lamp

**Files:**
- Create: `src/components/TiltCard.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/sections/Featured.tsx`
- Modify: `src/sections/CTA.tsx` (hoặc `Ecosystem.tsx` cho lamp header)
- Test: `tests/cards.test.ts`

**Interfaces:**
- Consumes: `prefersReducedMotion()`, `matchMedia('(pointer:fine)')`.
- Produces: `<TiltCard max={7} />`, `.border-gold-hover`, `.lamp-cone`, `[data-glow]` vars `--mx/--my`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
describe("cards", () => {
  it("tilt disabled on reduce/coarse", async () => {
    const mod = await import("../src/components/TiltCard.tsx");
    assert.equal(mod.shouldTilt(false, true), true);
    assert.equal(mod.shouldTilt(true, true), false);
    assert.equal(mod.shouldTilt(false, false), false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/cards.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement tilt 1 featured card, glow Hero+CTA, lamp Projects+CTA**

`perspective:1000px`, `rotate ±7°`, reset 400ms. Glow `radial 480px / .08` rAF-throttle. Lamp `conic-gradient` tĩnh + reveal-once.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/cards.test.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TiltCard.tsx src/styles/tokens.css src/sections/Featured.tsx tests/cards.test.ts
git commit -m "feat: tilt glow lamp border"
```

### Task 6: TimelineBeam + verify full

**Files:**
- Create: `src/sections/TimelineBeam.tsx`
- Modify: `src/sections/Journey.tsx`
- Test: `tests/timeline.test.ts`

**Interfaces:**
- Consumes: ScrollTrigger `scrub: 0.5`.
- Produces: spine vẽ theo scroll, `reduce` → đầy tĩnh.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
describe("timeline", () => {
  it("has scrub beam and static fallback", () => {
    const s = readFileSync("src/sections/TimelineBeam.tsx", "utf-8");
    assert.ok(s.includes("scrub"));
    assert.ok(s.includes("aria-hidden"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/timeline.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `TimelineBeam` (`stroke-dashoffset` → 0, scrub)**

1 path + dots `active` class; content list HTML thật cho SR.

- [ ] **Step 4: Run full verify**

Run: `npm test && npm run build && npx astro check`
Expected: PASS hết + check tay 375/768/1024/1440, keyboard, reduce OS.

- [ ] **Step 5: Commit**

```bash
git add src/sections/TimelineBeam.tsx src/sections/Journey.tsx tests/timeline.test.ts
git commit -m "feat: timeline draw on scroll"
```
