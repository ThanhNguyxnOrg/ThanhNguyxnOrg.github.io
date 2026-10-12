import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

describe("journey panel", () => {
  it("shows a sticky repo panel tracking the active stop", () => {
    const src = readFileSync("src/sections/Journey.tsx", "utf-8");
    assert.ok(src.includes("data-stop"), "stops tagged");
    assert.ok(src.includes("IntersectionObserver"), "active tracking");
    assert.ok(src.includes("sticky top-24"), "sticky panel");
  });
  it("falls back to the org board for untagged stops", () => {
    const src = readFileSync("src/sections/Journey.tsx", "utf-8");
    assert.ok(src.includes("/brand/org-github.jpg"), "org board fallback");
    assert.ok(existsSync("public/brand/org-github.jpg"), "board file exists");
  });
  it("passes projects for panel lookup", () => {
    const index = readFileSync("src/pages/index.astro", "utf-8");
    assert.ok(index.includes("projects={projects}"), "projects wired");
  });
  it("keeps sync stats compact without overflow", () => {
    const feat = readFileSync("src/sections/Featured.tsx", "utf-8");
    assert.ok(feat.includes("grid-cols-2"), "two stats");
    assert.ok(feat.includes("Last push"), "date on its own line");
  });
});
