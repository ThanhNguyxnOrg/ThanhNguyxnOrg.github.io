import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("prose decor", () => {
  it("frames the migration opener and quotes its closer", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes(".dropcap-framed"), "dropcap scope");
    assert.ok(css.includes("::first-line"), "small-caps first line");
    assert.ok(css.includes(".prose-migration"), "pull-quote scope");
  });
  it("marks prose lists and styles code", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes(".docs-prose ul > li::marker"), "dash markers");
    assert.ok(css.includes(".docs-prose :not(pre) > code"), "code chips");
  });
  it("gates reading progress behind supports and reduce", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("animation-timeline: scroll()"), "scroll timeline");
    assert.ok(css.includes("@supports"), "supports gate");
  });
});
