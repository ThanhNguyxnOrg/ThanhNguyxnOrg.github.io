import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("project visuals", () => {
  it("stacks narrow cards with full-width visuals", () => {
    const feat = readFileSync("src/sections/Featured.tsx", "utf-8");
    assert.ok(!feat.includes("md:col-span-2"), "no stretched side band");
    assert.ok(feat.includes("aspect-[2/1]"), "full-width 2:1 frames");
  });
  it("uses generative glyphs, no external brand images", () => {
    const bits = readFileSync("src/site/ProjectBits.tsx", "utf-8");
    assert.ok(!bits.includes("<img"), "no img tags");
    assert.ok(bits.includes("ProjectGlyph"), "glyph fallback");
    assert.ok(bits.includes("group-hover:scale"), "hover zoom");
  });
  it("no hardcoded lead highlights remain", () => {
    const src = readFileSync("src/sections/Featured.tsx", "utf-8");
    assert.ok(!src.includes("LEAD_HIGHLIGHTS"), "highlights removed");
    assert.ok(src.includes("SyncStats"), "sync stats present");
  });
});
