import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("ecosystem tidy", () => {
  it("sticks the intro column and clamps row text", () => {
    const src = readFileSync("src/sections/Ecosystem.tsx", "utf-8");
    assert.ok(src.includes("lg:sticky"), "sticky intro");
    assert.ok(src.includes("line-clamp-2"), "clamped descriptions");
  });
  it("keeps copy short", () => {
    const src = readFileSync("src/sections/Ecosystem.tsx", "utf-8");
    assert.ok(!src.includes("destinations without proof stay unlinked"), "trimmed");
  });
});
