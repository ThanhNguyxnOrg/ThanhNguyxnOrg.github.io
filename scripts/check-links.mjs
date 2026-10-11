import { readFileSync } from "node:fs";

const failures = [];
const warnings = [];

async function head(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "TNORG-link-check" },
      redirect: "follow",
    });
    return res.status;
  } catch (err) {
    return `ERR ${err.cause?.code ?? err.message}`;
  }
}

async function registry(pkg) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}`, {
      headers: { "User-Agent": "TNORG-link-check" },
    });
    return res.status;
  } catch (err) {
    return `ERR ${err.message}`;
  }
}

const html = readFileSync("dist/index.html", "utf-8");
const hrefs = [...new Set([...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((m) => m[1]))];
console.log(`external urls in page: ${hrefs.length}`);

for (const url of hrefs) {
  if (url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com")) {
    warnings.push(`skip third-party ${url}`);
    continue;
  }
  if (url.startsWith("https://www.npmjs.com/package/")) {
    const pkg = url.split("/").pop();
    const status = await registry(pkg);
    if (status === 200) console.log(`PASS 200 registry ${pkg} (page bot-walled, registry proves existence)`);
    else {
      failures.push(`${url} registry ${status}`);
      console.log(`FAIL registry ${status} ${url}`);
    }
    continue;
  }
  const status = await head(url);
  if (status === 200) console.log(`PASS 200 ${url}`);
  else {
    failures.push(`${url} -> ${status}`);
    console.log(`FAIL ${status} ${url}`);
  }
}

if (warnings.length > 0) console.log(`warnings: ${warnings.length}`);
if (failures.length > 0) {
  console.log(`${failures.length} FAILURES`);
  process.exit(1);
}
console.log("check-links: all green");
