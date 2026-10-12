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
