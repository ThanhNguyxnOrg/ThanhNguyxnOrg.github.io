import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("about airy", () => {
  it("charts language share with bars", () => {
    const about = readFileSync("src/pages/about.astro", "utf-8");
    assert.ok(about.includes("lang-bar"), "bar rows");
    assert.ok(about.includes("max"), "proportional widths");
  });
  it("gives prose sections rhythm", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes(".docs-prose > h2"), "h2 rule");
    assert.ok(css.includes("border-top"), "h2 divider");
  });
});
