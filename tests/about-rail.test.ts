import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("about side rail", () => {
  it("rails both prose sections on desktop", () => {
    const about = readFileSync("src/pages/about.astro", "utf-8");
    assert.ok(about.includes("side-rail"), "rail used");
    assert.ok((about.match(/side-rail/g) || []).length >= 2, "both sections");
  });
  it("defines the rail once in tokens", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("side-rail"), "rail utility");
    assert.ok(css.includes("writing-mode"), "vertical label");
    assert.ok(css.includes("side-rail-plate"), "plate stamp");
    assert.ok(css.includes("side-rail-figure"), "photo frame");
    assert.ok(css.includes("rail-drift"), "photo drift effect");
    assert.ok(css.includes("side-rail-meter"), "meter band");
  });
  it("rails use local brand photos", () => {
    const about = readFileSync("src/pages/about.astro", "utf-8");
    assert.ok(about.includes("/brand/org-github.jpg"), "migration photo");
    assert.ok(about.includes("/brand/cogmint.png"), "stack photo");
  });
});
