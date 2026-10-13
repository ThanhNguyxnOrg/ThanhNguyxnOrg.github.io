import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("decor leftovers", () => {
  it("ends philosophy cells with tombstones", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("tombstone"), "tombstone rule");
    assert.ok(readFileSync("src/sections/Philosophy.tsx", "utf-8").includes("tombstone"), "cells marked");
  });
  it("pull-quotes the migration goal", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes(".prose-migration > p:last-of-type"), "goal pull-quote");
  });
  it("kicks footer columns and fixes cta index link", () => {
    const sf = readFileSync("src/components/SiteFooter.tsx", "utf-8");
    assert.ok(sf.includes("h-0.5 w-6 bg-primary/70"), "kicker marks");
    const cta = readFileSync("src/sections/CTA.tsx", "utf-8");
    assert.ok(cta.includes('href="/projects"'), "index link resolves everywhere");
  });
});
