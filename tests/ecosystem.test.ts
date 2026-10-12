import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("ecosystem rows", () => {
  it("has version chip, downloads chip, install command and avatars", () => {
    const src = readFileSync("src/sections/Ecosystem.tsx", "utf-8");
    assert.ok(src.includes("r.version"), "version chip");
    assert.ok(src.includes("r.downloads"), "downloads chip");
    assert.ok(src.includes("npm i"), "install command");
    assert.ok(src.includes("CopyButton"), "copy button");
    assert.ok(src.includes(".png"), "avatars");
  });
  it("passes package data from baked npm", () => {
    const index = readFileSync("src/pages/index.astro", "utf-8");
    assert.ok(index.includes("package:"), "package field");
  });
});
