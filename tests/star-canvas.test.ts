import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("star canvas guard", () => {
  it("does not enhance on reduce or small screen", async () => {
    const mod = await import("../src/lib/enhance.ts");
    assert.equal(mod.shouldEnhance(true, 800), false);
    assert.equal(mod.shouldEnhance(false, 360), false);
    assert.equal(mod.shouldEnhance(false, 1024), true);
  });
});
