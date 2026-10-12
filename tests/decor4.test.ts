import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("decor4 plus", () => {
  it("fades marquee edges and frames metrics", () => {
    const m = readFileSync("src/sections/TechMarquee.tsx", "utf-8");
    assert.ok(m.includes("mask-x-from-85%"), "edge fade");
    const mb = readFileSync("src/sections/MetricsBand.tsx", "utf-8");
    assert.ok(mb.includes("rounded-xl border border-border"), "framed band");
  });
  it("hairs card footers and tombstones philosophy", () => {
    const f = readFileSync("src/sections/Featured.tsx", "utf-8");
    assert.ok(f.includes("border-t border-border pt-5"), "footer hairline");
    const p = readFileSync("src/sections/Philosophy.tsx", "utf-8");
    assert.ok(p.includes("principle-body"), "tombstone scope");
    assert.ok(readFileSync("src/styles/tokens.css", "utf-8").includes(".principle-body::after"), "tombstone rule");
  });
  it("frames cta, kickers footer, rails mobile nav", () => {
    const c = readFileSync("src/sections/CTA.tsx", "utf-8");
    assert.ok(c.includes("outline-offset-8"), "offset frame");
    const sf = readFileSync("src/components/SiteFooter.tsx", "utf-8");
    assert.ok(sf.includes("h-0.5 w-6 bg-primary/70"), "kicker rule");
    const nav = readFileSync("src/components/SiteNav.tsx", "utf-8");
    assert.ok(nav.includes("divide-y divide-border"), "row hairlines");
    assert.ok(nav.includes("self-stretch bg-primary"), "current rail");
  });
  it("pages the explorer list", () => {
    const ex = readFileSync("src/sections/Explorer.tsx", "utf-8");
    assert.ok(ex.includes("visibleCount"), "paged state");
    assert.ok(ex.includes("Show all"), "show-all button");
  });
});
