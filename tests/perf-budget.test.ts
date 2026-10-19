import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function pngSize(f: string): { width: number; height: number } | null {
  const b = readFileSync(f);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function images(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
    .map((f) => join(dir, f));
}

function isLogo(path: string): boolean {
  return path.split(/[\\/]/).includes("logos");
}

describe("perf budget", () => {
  it("keeps served images within display budgets", () => {
    const over: string[] = [];
    for (const f of [...images("public/logos"), ...images("public/brand")]) {
      const size = pngSize(f);
      if (size === null) continue;
      const logo = isLogo(f);
      const cap = logo ? 256 : 1024;
      if (size.width > cap || size.height > cap) over.push(`${f} (${size.width}x${size.height})`);
      if (!logo && (size.width !== 1024 || size.height !== 512)) over.push(`${f} (theme must be 1024x512)`);
    }
    assert.deepEqual(over, [], "oversized images");
  });
  it("ships robots and sitemap", () => {
    assert.ok(existsSync("public/robots.txt"), "robots");
    const sm = readFileSync("public/sitemap.xml", "utf-8");
    for (const p of ["https://thanhnguyxnorg.github.io/projects", "/journey", "/about"]) assert.ok(sm.includes(p), p);
  });
});
