import { readdir, rename, stat, unlink } from "node:fs/promises";
import { join, parse, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const CHECK = process.argv.includes("--check");
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const RASTER = /\.(png|jpe?g|webp)$/i;

const rules = [
  {
    dir: join(ROOT, "public/logos"),
    needs: (meta) => meta.width > 256 || meta.height > 256 || meta.format !== "png",
    describe: (meta) => `${meta.width}x${meta.height} ${meta.format} (max 256px, png)`,
    encode: (img) =>
      img.resize({ width: 256, height: 256, fit: "inside", withoutEnlargement: true }).png({ compressionLevel: 9 }),
  },
  {
    dir: join(ROOT, "public/brand"),
    needs: (meta) => meta.width !== 1024 || meta.height !== 512 || meta.format !== "png",
    describe: (meta) => `${meta.width}x${meta.height} ${meta.format} (expects 1024x512 png)`,
    encode: (img) =>
      img.resize({ width: 1024, height: 512, fit: "cover", position: "centre" }).png({ compressionLevel: 9 }),
  },
];

const changed = [];
const outOfSpec = [];
let scanned = 0;

for (const rule of rules) {
  let files = [];
  try {
    files = (await readdir(rule.dir)).filter((f) => RASTER.test(f));
  } catch {
    continue;
  }
  for (const name of files) {
    const src = join(rule.dir, name);
    if (!(await stat(src)).isFile()) continue;
    scanned += 1;
    const meta = await sharp(src).metadata();
    if (!rule.needs(meta)) continue;
    const rel = relative(ROOT, src).replaceAll("\\", "/");
    if (CHECK) {
      outOfSpec.push(`${rel}: ${rule.describe(meta)}`);
      continue;
    }
    const target = join(rule.dir, `${parse(name).name}.png`);
    const tmp = `${target}.tmp.png`;
    await rule.encode(sharp(src).rotate()).toFile(tmp);
    await rename(tmp, target);
    if (target !== src) await unlink(src);
    changed.push(`${rel} -> ${relative(ROOT, target).replaceAll("\\", "/")}`);
  }
}

for (const rel of changed) console.log(`normalized ${rel}`);
for (const rel of outOfSpec) console.log(`out of spec ${rel}`);

if (CHECK && outOfSpec.length > 0) {
  console.error(`brand check failed: ${outOfSpec.length} asset(s). Run npm run brand:sync.`);
  process.exit(1);
}

console.log(
  CHECK
    ? `brand check: ${outOfSpec.length === 0 ? "all green" : `${outOfSpec.length} out of spec`}`
    : `brand sync: ${changed.length} normalized, ${scanned - changed.length} unchanged`,
);
