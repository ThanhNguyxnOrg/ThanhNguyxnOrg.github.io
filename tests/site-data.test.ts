import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("site data", () => {
  it("loads page data through one shared loader", () => {
    const index = readFileSync("src/pages/index.astro", "utf-8");
    assert.ok(index.includes("loadSiteData"), "index uses shared loader");
    assert.ok(!index.includes("getCollection('repos')"), "no inline repo join");
    const lib = readFileSync("src/lib/site-data.ts", "utf-8");
    assert.ok(lib.includes("joinProjects"), "joins numbers with voice");
  });
});
