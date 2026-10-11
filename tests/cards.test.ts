import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("cards", () => {
  it("tilt disabled on reduce/coarse", async () => {
    const mod = await import("../src/lib/enhance.ts");
    assert.equal(mod.shouldTilt(false, true), true);
    assert.equal(mod.shouldTilt(true, true), false);
    assert.equal(mod.shouldTilt(false, false), false);
  });
  it("has tilt component and gold border + lamp tokens", () => {
    assert.ok(readFileSync("src/components/TiltCard.tsx", "utf-8").includes("preserve-3d"));
    const css = readFileSync("src/styles/tokens.css", "utf-8");
    assert.ok(css.includes("border-gold-hover"));
    assert.ok(css.includes("lamp-cone"));
  });
});
