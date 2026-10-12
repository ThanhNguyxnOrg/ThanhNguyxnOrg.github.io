import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("decor3 max", () => {
  it("has caret, target, counters, balance, gutter, ruler, notch, separators", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("caret-color"), "gold caret");
    assert.ok(css.includes(":target"), "target flash");
    assert.ok(css.includes("counter-reset: principle"), "css counters");
    assert.ok(css.includes("text-wrap: balance"), "balanced headlines");
    assert.ok(css.includes("cta-notch"), "cta corner cut");
    assert.ok(css.includes(".legal"), "footer separators");
  });
  it("wires philosophy counters, explorer gutter, journey ruler", () => {
    assert.ok(readFileSync("src/sections/Philosophy.tsx", "utf-8").includes("principles"), "counter scope");
    assert.ok(readFileSync("src/sections/Explorer.tsx", "utf-8").includes("scrollbar-gutter"), "stable gutter");
    assert.ok(readFileSync("src/sections/Journey.tsx", "utf-8").includes("sticky top-24"), "panel placed");
  });
  it("footer bottom uses css separators, no hardcoded strings", () => {
    const f = readFileSync("src/components/SiteFooter.tsx", "utf-8");
    assert.ok(!f.includes("{' + '}"), "no hardcoded plus");
    assert.ok(!f.includes("· shipped by"), "no hardcoded dot");
  });
});
