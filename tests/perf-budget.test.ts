import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function pngWidth(f: string): number | null {
  const b = readFileSync(f);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return b.readUInt32BE(16);
}

function images(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
    .map((f) => join(dir, f));
}

describe("perf budget", () => {
  it("keeps served images within display budgets", () => {
    const over: string[] = [];
    for (const f of [...images("public/logos"), ...images("public/brand")]) {
      const w = pngWidth(f);
      if (w === null) continue;
      const cap = f.includes("public/logos") ? 256 : 1024;
      if (w > cap) over.push(`${f} (${w}px)`);
    }
    assert.deepEqual(over, [], "oversized images");
  });
  it("ships robots and sitemap", () => {
    assert.ok(existsSync("public/robots.txt"), "robots");
    const sm = readFileSync("public/sitemap.xml", "utf-8");
    for (const p of ["https://thanhnguyxnorg.github.io/projects", "/journey", "/about"]) assert.ok(sm.includes(p), p);
  });
});
