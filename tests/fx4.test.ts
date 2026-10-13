import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("fx4 batch", () => {
  it("cues scroll at hero bottom", () => {
    const hero = readFileSync("src/sections/Hero.tsx", "utf-8");
    assert.ok(hero.includes("animate-bounce"), "bounce cue");
    assert.ok(hero.includes('#projects'), "points at projects");
  });
  it("dims unfocused cards and clones gradient boxes", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("focus-dim"), "focus-dim grid");
    assert.ok(css.includes("box-decoration-break"), "fragment clone");
  });
  it("hides redundant labels on real-image cards", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes(":has(img)"), "has selector");
    assert.ok(css.includes("project-label"), "label hook");
  });
  it("shadows solid titles", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("title-shadow"), "title shadow");
  });
});
