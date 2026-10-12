import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("decor batch 1", () => {
  it("has grid variants, divider ornament and corner ticks", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("bg-blueprint-fine"), "fine grid");
    assert.ok(css.includes("bg-dots-gold"), "gold dots");
    assert.ok(css.includes("divider-orn"), "divider ornament");
    assert.ok(css.includes("card-ticks"), "corner ticks");
    const ticks = css.slice(css.indexOf("card-ticks"));
    assert.ok(ticks.includes("background-position"), "ticks drawn inside all 4 corners");
  });
  it("wires decor into sections", () => {
    assert.ok(readFileSync("src/sections/Philosophy.tsx", "utf-8").includes("bg-blueprint-fine"));
    assert.ok(readFileSync("src/sections/Explorer.tsx", "utf-8").includes("bg-dots-gold"));
    const featured = readFileSync("src/sections/Featured.tsx", "utf-8");
    assert.ok(featured.includes("card-ticks"));
  });
});
