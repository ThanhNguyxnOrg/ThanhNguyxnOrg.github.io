import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("visual trio", () => {
  it("chips stars and forks on small cards", () => {
    const src = readFileSync("src/sections/Featured.tsx", "utf-8");
    assert.ok(src.includes("StatChips") || src.includes("stat-chip"), "chips component");
  });
  it("sparklines repo stars in metrics", () => {
    const src = readFileSync("src/sections/MetricsBand.tsx", "utf-8");
    assert.ok(src.includes("Sparkline") || src.includes("spark"), "sparkline");
    const index = readFileSync("src/pages/index.astro", "utf-8");
    assert.ok(index.includes("stars=") || index.includes("stars }"), "stars wired");
  });
});
