import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("review fixes", () => {
  it("hydrates islands needing JS", () => {
    const lines = readFileSync("src/pages/index.astro", "utf-8").split("\n");
    const has = (name: string) => lines.some((l) => l.includes(`<${name}`) && l.includes("client:"));
    assert.ok(has("Featured"), "Featured island");
    assert.ok(has("Journey"), "Journey island");
    assert.ok(has("CTA"), "CTA island");
  });
  it("timeline keeps spine under reduced-motion", () => {
    const s = readFileSync("src/sections/TimelineBeam.tsx", "utf-8");
    assert.ok(!s.includes("motion-reduce:hidden"), "no hidden spine");
  });
  it("tilt respects reduced-motion", () => {
    const s = readFileSync("src/components/TiltCard.tsx", "utf-8");
    assert.ok(s.includes("prefersReducedMotion"), "tilt checks motion");
  });
  it("canvas pauses offscreen", () => {
    const s = readFileSync("src/components/StarCanvas.tsx", "utf-8");
    assert.ok(s.includes("IntersectionObserver"), "IO gate");
  });
  it("metrics has no dead count tween", () => {
    const s = readFileSync("src/sections/MetricsBand.tsx", "utf-8");
    assert.ok(!s.includes("data-count"), "no dead selector");
  });
});
