import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("nav", () => {
  it("links pages, never bare anchors", () => {
    const layout = readFileSync("src/layouts/Layout.astro", "utf-8");
    for (const href of ["/projects", "/journey", "/about", "/#support"]) assert.ok(layout.includes(href), href);
    assert.ok(!layout.includes('href="#projects"'), "no bare anchor");
  });
});
describe("projects page", () => {
  it("renders full index on /projects and teaser on home", async () => {
    const { readFileSync } = await import("node:fs");
    assert.ok(readFileSync("src/pages/projects.astro", "utf-8").includes("<Explorer"));
    assert.ok(readFileSync("src/sections/Explorer.tsx", "utf-8").includes("previewHref"));
  });
});
describe("journey page", () => {
  it("renders full timeline on /journey and teaser on home", async () => {
    const { readFileSync } = await import("node:fs");
    assert.ok(readFileSync("src/pages/journey.astro", "utf-8").includes("<Journey"));
    assert.ok(readFileSync("src/sections/Journey.tsx", "utf-8").includes("limit"));
  });
});
