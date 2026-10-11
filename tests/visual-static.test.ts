import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("visual static", () => {
  it("has gold gradient token and tabular-nums", () => {
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("text-gradient-gold"));
    assert.ok(css.includes("tabular-nums"));
  });
  it("hero constellation allows overflow visible", () => {
    const hero = readFileSync("src/sections/Hero.tsx", "utf-8");
    assert.ok(hero.includes("overflow-visible"));
  });
});
