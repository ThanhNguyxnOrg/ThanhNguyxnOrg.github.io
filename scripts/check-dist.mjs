import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const failures = [];

function fail(msg) {
  failures.push(msg);
  console.log(`FAIL ${msg}`);
}
function pass(msg) {
  console.log(`PASS ${msg}`);
}

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf-8");

// 1. Non-ASCII allowlist: U+00A9 only, never U+2014/U+2013.
for (const [name, ch] of [["EM DASH", "—"], ["EN DASH", "–"]]) {
  if (html.includes(ch)) fail(`${name} found in dist/index.html`);
  else pass(`no ${name}`);
}
const odd = [...new Set([...html].filter((c) => c.codePointAt(0) > 127 && c !== "©"))];
if (odd.length > 0) fail(`unexpected non-ASCII: ${odd.map((c) => `U+${c.codePointAt(0).toString(16)}`).join(",")}`);
else pass("non-ASCII allowlist clean (only U+00A9)");

// 2. No figma word anywhere in shipped text assets.
function textFiles(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) {
      if (f === ".git" || f === "node_modules") continue;
      textFiles(p, out);
    } else if (/\.(html|css|js|txt|xml|json|svg)$/.test(f)) out.push(p);
  }
  return out;
}
const hits = [];
for (const f of textFiles(distDir)) {
  try {
    const t = readFileSync(f, "utf-8");
    if (/figma/i.test(t)) hits.push(f);
  } catch {
    /* binary, skip */
  }
}
if (hits.length > 0) fail(`figma hits: ${hits.join(",")}`);
else pass("zero figma hits in dist");

// 3. Internal anchors resolve, static files exist.
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
for (const m of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(m[1])) fail(`dangling anchor #${m[1]}`);
}
pass("anchors resolve");
for (const f of ["og-image.png", "llms.txt", "favicon.ico", "apple-touch-icon.png", "logo.png"]) {
  try {
    statSync(new URL(`../dist/${f}`, import.meta.url));
    pass(`dist has ${f}`);
  } catch {
    fail(`dist missing ${f}`);
  }
}

// 4. Meta tags point at shipped files.
for (const s of ["/og-image.png", "/llms.txt", "summary_large_image"]) {
  if (!html.includes(s)) fail(`meta missing ${s}`);
}
pass("meta tags present");

if (failures.length > 0) {
  console.log(`${failures.length} FAILURES`);
  process.exit(1);
}
console.log("check-dist: all green");
