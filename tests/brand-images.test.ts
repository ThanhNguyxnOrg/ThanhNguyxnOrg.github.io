import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

describe("brand images", () => {
  it("every repo entry with an image points at a real file", () => {
    const dir = "src/content/repos";
    let checked = 0;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const text = readFileSync(`${dir}/${f}`, "utf-8");
      const m = text.match(/^image:\s*"([^"]+)"/m);
      if (!m) continue;
      assert.ok(existsSync(`public${m[1]}`), `missing ${m[1]} for ${f}`);
      checked += 1;
    }
    assert.ok(checked >= 15, `expected 15 images, checked ${checked}`);
  });
  it("shows whole boards in compact thumbs", () => {
    const bits = readFileSync("src/site/ProjectBits.tsx", "utf-8");
    assert.ok(bits.includes("object-contain"), "contain for thumbs");
    assert.ok(bits.includes("compact"), "compact flag");
  });
  it("stacks narrow cards and decorates image frames", () => {
    const feat = readFileSync("src/sections/Featured.tsx", "utf-8");
    assert.ok(!feat.includes("md:col-span-2"), "no stretched side band");
    const bits = readFileSync("src/site/ProjectBits.tsx", "utf-8");
    assert.ok(bits.includes("from-black/60"), "scrim");
    assert.ok(bits.includes("image-frame"), "frame glow");
    assert.ok(bits.includes("group-hover:scale"), "hover zoom");
    assert.ok(bits.includes("1280×640"), "format badge");
  });
  it("no hardcoded lead highlights remain", () => {
    const src = readFileSync("src/sections/Featured.tsx", "utf-8");
    assert.ok(!src.includes("LEAD_HIGHLIGHTS"), "highlights removed");
    assert.ok(src.includes("SyncStats"), "sync stats present");
  });
});
