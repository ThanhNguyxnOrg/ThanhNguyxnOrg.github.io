import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("eco header", () => {
  it("stacks title over description without column conflict", () => {
    const c = readFileSync("src/components/Content.tsx", "utf-8");
    assert.ok(c.includes("stacked"), "stacked prop");
    const e = readFileSync("src/sections/Ecosystem.tsx", "utf-8");
    assert.ok(e.includes("stacked"), "ecosystem stacks");
    assert.ok(!e.includes('className="lg:grid-cols-1"'), "no fragile override");
  });
});
