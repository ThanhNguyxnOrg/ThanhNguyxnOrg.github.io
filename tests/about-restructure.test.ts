import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("about restructure", () => {
  it("numbers prose h2s with ghost counters", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("prose-h2"), "h2 counter scope");
    assert.ok(css.includes("counter(prose-h2)"), "counter render");
  });
  it("lays prose lists in two columns on desktop", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes(".docs-prose ul"), "list scope");
    assert.ok(css.includes("columns-2") || css.includes("columns: 2"), "two columns");
  });
});
