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
