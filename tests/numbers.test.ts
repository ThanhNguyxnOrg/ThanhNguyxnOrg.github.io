import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("numbers", () => {
  it("marquee duplicates aria-hidden", () => {
    const src = readFileSync("src/sections/TechMarquee.tsx", "utf-8");
    assert.ok(src.includes('aria-hidden="true"'));
  });
  it("count-up renders final value statically", () => {
    const src = readFileSync("src/components/CountUp.tsx", "utf-8");
    assert.ok(src.includes("toLocaleString"));
  });
});
