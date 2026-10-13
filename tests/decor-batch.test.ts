import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("decor batch B", () => {
  it("keeps a single migration pull-quote rule", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    const hits = css.split(".prose-migration > p:last-of-type").length - 1;
    assert.equal(hits, 1, "no duplicate pull-quote selector");
    assert.ok(css.includes(".docs-prose.prose-migration > p:last-of-type"), "layered scope kept");
  });
  it("shares one end-mark rule instead of two", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes(".principle-body::after"), "cell scope kept");
    assert.ok(css.includes(".tombstone::after"), "tombstone class kept");
  });
  it("adds a cheap settle variant to Reveal and uses it once at the Featured lead", () => {
    const reveal = readFileSync("src/motion/Reveal.tsx", "utf-8");
    assert.ok(reveal.includes("settle"), "variant exists");
    assert.ok(reveal.includes("scale"), "scale-based entrance");
    assert.ok(reveal.includes("MOTION_OK_QUERY"), "reduced-motion gate kept");
    const featured = readFileSync("src/sections/Featured.tsx", "utf-8");
    const uses = featured.split('variant="settle"').length - 1;
    assert.equal(uses, 1, "lead only");
  });
});
