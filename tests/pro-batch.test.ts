import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";

describe("pro batch: og image", () => {
  it("og-image.png exists, is 1200x630 PNG under 300 KB", () => {
    const p = "public/og-image.png";
    assert.ok(existsSync(p), "public/og-image.png exists");
    const buf = readFileSync(p);
    assert.ok(buf.length < 300 * 1024, `og-image under 300 KB (got ${buf.length})`);
    assert.deepEqual(
      [...buf.subarray(0, 8)],
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      "PNG signature",
    );
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    assert.equal(width, 1200, "og width 1200");
    assert.equal(height, 630, "og height 630");
  });
});

describe("pro batch: one h1 per page", () => {
  for (const page of ["projects", "journey", "about"]) {
    it(`/ ${page} has exactly one h1`, () => {
      const src = readFileSync(`src/pages/${page}.astro`, "utf-8");
      const count = (src.match(/<h1[\s>]/g) ?? []).length;
      assert.equal(count, 1, `${page}.astro has exactly 1 h1 (got ${count})`);
    });
  }
});

describe("pro batch: layout seo", () => {
  it("canonical + JSON-LD Organization in Layout", () => {
    const src = readFileSync("src/layouts/Layout.astro", "utf-8");
    assert.ok(src.includes('rel="canonical"'), "canonical link");
    assert.ok(src.includes("https://thanhnguyxnorg.github.io"), "site url");
    assert.ok(src.includes("og:type"), "og:type");
    assert.ok(src.includes("og:url"), "og:url");
    assert.ok(src.includes("og:site_name"), "og:site_name");
    assert.ok(src.includes("twitter:title"), "twitter:title");
    assert.ok(src.includes("twitter:description"), "twitter:description");
    assert.ok(src.includes("twitter:image"), "twitter:image");
    assert.ok(src.includes("application/ld+json"), "JSON-LD script");
    assert.ok(src.includes("Organization"), "Organization schema");
    assert.ok(src.includes("fonts.googleapis.com"), "preconnect googleapis");
    assert.ok(src.includes("fonts.gstatic.com"), "preconnect gstatic");
  });

  it('no invalid rel="describedby" and no bogus favicon sizes', () => {
    const src = readFileSync("src/layouts/Layout.astro", "utf-8");
    assert.ok(!src.includes('rel="describedby"'), "describedby removed");
    assert.ok(!src.includes('sizes="16x16 32x32 48x48"'), "favicon sizes fixed");
  });
});

describe("pro batch: a11y fixes", () => {
  it("ScrollProgress always renders, hidden via motion-reduce class", () => {
    const src = readFileSync("src/components/ScrollProgress.tsx", "utf-8");
    assert.ok(!src.includes("return null"), "no conditional null return");
    assert.ok(src.includes("motion-reduce:hidden"), "motion-reduce:hidden");
  });

  it("lazy images decode async", () => {
    for (const f of ["src/site/ProjectBits.tsx", "src/sections/Ecosystem.tsx", "src/sections/Journey.tsx"]) {
      const src = readFileSync(f, "utf-8");
      const imgs = src.match(/<img[\s\S]*?>/g) ?? [];
      assert.ok(imgs.length > 0, `${f} has img`);
      for (const img of imgs) assert.ok(img.includes('decoding="async"'), `${f}: ${img.slice(0, 60)}`);
    }
  });

  it("touch targets are at least 44px", () => {
    const filter = readFileSync("src/components/FilterGroup.tsx", "utf-8");
    assert.ok(!filter.includes("h-9 ") && !filter.includes("h-8 "), "no sub-44px chip heights");
    assert.ok(filter.includes("min-h-11"), "FilterGroup min-h-11");
    const search = readFileSync("src/components/SearchField.tsx", "utf-8");
    assert.ok(!search.includes("size-8"), "clear button not size-8");
    assert.ok(search.includes("size-11"), "clear button size-11");
    const icon = readFileSync("src/components/IconButton.tsx", "utf-8");
    assert.ok(!icon.includes("size-9"), "IconButton sm not size-9");
  });
});
