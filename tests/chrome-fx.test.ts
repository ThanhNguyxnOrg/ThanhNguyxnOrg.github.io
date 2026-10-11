import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("chrome fx", () => {
  it("has noise overlay token", () => {
    assert.ok(readFileSync("src/styles/tokens.css", "utf-8").includes("noise-overlay"));
  });
});
