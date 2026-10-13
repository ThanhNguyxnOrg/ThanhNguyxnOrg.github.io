import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("about polish", () => {
  it("keeps the dropcap a plain gold letter", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes(".dropcap-framed"), "scope kept");
    assert.ok(!css.includes("::first-line"), "no shouty first line");
    const block = css.slice(css.indexOf(".dropcap-framed"));
    assert.ok(!block.slice(0, 600).includes("border:"), "no boxed letter");
  });
  it("gives the migration prose a real headline", () => {
    const about = readFileSync("src/pages/about.astro", "utf-8");
    assert.ok(about.includes("migration-title"), "titled section");
    assert.ok(about.includes("Migration & Legacy Note"), "headline present");
  });
});
