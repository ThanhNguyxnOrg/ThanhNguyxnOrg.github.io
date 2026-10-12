import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { BakedDataSchema, type BakedNpm } from "../src/lib/baked.ts";

const ORG = "ThanhNguyxnOrg";
const NPM_PACKAGES = ["archpulse", "production-backend-kit"];

/**
 * Bake verified org data to JSON. Reads GitHub + npm + Pages status,
 * writes nothing on its own (caller decides via outPath/changed).
 * Every number traces to a live response; failures degrade to
 * `unverified` flags and warnings, never invented values.
 */
export async function runSync(opts: {
  apiBase: string;
  npmRegistryBase: string;
  npmDownloadsBase: string;
  pagesBase: string;
  token?: string;
  outPath?: string;
  contentDir?: string;
  /** Previous npm entries: kept (with a warning) when the registry is unreachable, so a blip never zeroes public numbers. */
  prevNpm?: BakedNpm[];
}) {
  const warnings: string[] = [];
  let requests = 0;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ThanhNguyxnOrg-site-sync",
  };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  async function gh(path: string) {
    requests += 1;
    const res = await fetch(`${opts.apiBase}${path}`, { headers });
    const remaining = res.headers.get("x-ratelimit-remaining");
    const quota = remaining === null ? null : Number(remaining);
    if (!res.ok) return { status: res.status as number, json: null as unknown, quota };
    return { status: res.status as number, json: (await res.json()) as unknown, quota };
  }

  async function get(url: string) {
    const res = await fetch(url, { headers: { "User-Agent": "ThanhNguyxnOrg-site-sync" } });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  }

  let quotaLow = false;
  function noteQuota(quota: number | null) {
    if (quota !== null && quota < 10 && !quotaLow) {
      quotaLow = true;
      warnings.push(`WARN GitHub quota low (${quota} remaining), skipping further API calls`);
    }
  }

  const org = await gh(`/orgs/${ORG}`);
  if (org.status !== 200 || org.json === null) throw new Error(`org fetch failed: ${org.status}`);
  noteQuota(org.quota);
  const orgData = org.json as { public_repos: number; followers: number; created_at?: string };

  const list = await gh(`/orgs/${ORG}/repos?per_page=100`);
  if (list.status !== 200 || !Array.isArray(list.json)) throw new Error(`repos fetch failed: ${list.status}`);
  noteQuota(list.quota);
  const apiRepos = (list.json as Record<string, unknown>[]).filter((r) => r.fork !== true);

  const repos = [];
  for (const r of apiRepos) {
    const name = r.name as string;
    const unverified: string[] = [];
    let language = (r.language as string | null) ?? "Docs";
    if (!quotaLow) {
      const langs = await gh(`/repos/${ORG}/${encodeURIComponent(name)}/languages`);
      noteQuota(langs.quota);
      if (langs.status === 200 && langs.json && typeof langs.json === "object") {
        const entries = Object.entries(langs.json as Record<string, number>);
        if (entries.length > 0) {
          const top = entries.sort((a, b) => b[1] - a[1])[0][0];
          if (top !== language) warnings.push(`WARN ${name}: primary language ${language} differs from bytes top ${top}`);
        }
      } else {
        unverified.push("languages");
        warnings.push(`WARN ${name}: languages endpoint ${langs.status}, using primary language`);
      }
    } else {
      unverified.push("languages");
    }

    let demoUrl: string | null = null;
    if (r.has_pages === true) {
      const check = await fetch(`${opts.pagesBase}/${name}/`, { method: "HEAD" });
      if (check.status === 200) demoUrl = `${opts.pagesBase}/${name}/`;
      else warnings.push(`WARN ${name}: has_pages true but demo URL returns ${check.status}`);
    }

    let homepage = (r.homepage as string | null) ?? null;
    if (homepage && homepage.startsWith(opts.pagesBase)) {
      const check = await fetch(homepage, { method: "HEAD" });
      if (check.status !== 200) {
        warnings.push(`WARN ${name}: homepage dead (${check.status}), nulled`);
        homepage = null;
      }
    }

    repos.push({
      name,
      repoUrl: r.html_url as string,
      description: (r.description as string | null) ?? "",
      language,
      license: ((r.license as { spdx_id?: string } | null)?.spdx_id as string | undefined) ?? null,
      stars: (r.stargazers_count as number) ?? 0,
      forks: (r.forks_count as number) ?? 0,
      openIssues: (r.open_issues_count as number) ?? 0,
      pushedAt: r.pushed_at as string,
      createdAt: r.created_at as string,
      defaultBranch: r.default_branch as string,
      hasPages: r.has_pages === true,
      demoUrl,
      homepage,
      topics: ((r.topics as string[]) ?? []).slice(),
      unverified,
    });
  }

  const npm = [];
  let downloads30d = 0;
  for (const pkg of NPM_PACKAGES) {
    const meta = (await get(`${opts.npmRegistryBase}/${pkg}`)) as {
      name: string;
      "dist-tags": { latest: string };
      versions: Record<string, { description?: string; keywords?: string[] }>;
    } | null;
    const dl = (await get(`${opts.npmDownloadsBase}/downloads/point/last-month/${pkg}`)) as {
      downloads?: number;
    } | null;
    if (!meta || !dl || typeof dl.downloads !== "number") {
      const prev = (opts.prevNpm ?? []).find((p) => p.name === pkg);
      if (prev) {
        warnings.push(`WARN npm ${pkg}: metadata incomplete, keeping previous v${prev.version}`);
        npm.push(prev);
        downloads30d += prev.downloads30d;
        continue;
      }
      warnings.push(`WARN npm ${pkg}: metadata incomplete, skipped`);
      continue;
    }
    const latest = meta["dist-tags"].latest;
    const v = meta.versions[latest] ?? {};
    npm.push({
      name: meta.name,
      version: latest,
      description: v.description ?? "",
      keywords: v.keywords ?? [],
      downloads30d: dl.downloads,
    });
    downloads30d += dl.downloads;
  }

  if (opts.contentDir) {
    const files = readdirSync(opts.contentDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const text = readFileSync(`${opts.contentDir}/${f}`, "utf-8");
        const m = text.match(/^slug:\s*["']?([^"'\s]+)["']?/m);
        return (m?.[1] ?? f.slice(0, -3)).toLowerCase();
      });
    const apiSlugs = new Set(repos.map((r) => r.name.toLowerCase()));
    for (const r of repos) {
      if (!files.includes(r.name.toLowerCase())) warnings.push(`WARN unknown repo ${r.name}`);
    }
    for (const f of files) {
      if (!apiSlugs.has(f)) warnings.push(`WARN stale content ${f}`);
    }
  }

  const languages = [...new Set(repos.map((r) => r.language))].sort();
  const data = BakedDataSchema.parse({
    fetchedAt: new Date().toISOString().slice(0, 10),
    foundedAt: typeof orgData.created_at === "string" ? orgData.created_at.slice(0, 10) : null,
    totals: {
      repos: repos.length,
      stars: repos.reduce((s, r) => s + r.stars, 0),
      forks: repos.reduce((s, r) => s + r.forks, 0),
      openIssues: repos.reduce((s, r) => s + r.openIssues, 0),
      languages,
      packages: npm.length,
      demos: repos.filter((r) => r.demoUrl !== null).length,
      downloads30d,
      followers: orgData.followers ?? 0,
    },
    repos: repos.sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name)),
    npm,
  });

  let changed = true;
  if (opts.outPath) {
    let prev = "";
    try {
      prev = readFileSync(opts.outPath, "utf-8");
    } catch {
      prev = "";
    }
    const next = `${JSON.stringify(data, null, 2)}\n`;
    changed = prev !== next;
    if (changed) writeFileSync(opts.outPath, next);
  }

  return { data, warnings, requests, changed };
}

function arg(name: string, fallback: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

if (process.argv[1]?.endsWith("sync.ts")) {
  const outPath = arg("out", "src/data/baked.json");
  let prevNpm: BakedNpm[] | undefined;
  try {
    prevNpm = BakedDataSchema.parse(JSON.parse(readFileSync(outPath, "utf-8"))).npm;
  } catch {
    prevNpm = undefined;
  }
  runSync({
    apiBase: arg("api-base", "https://api.github.com"),
    npmRegistryBase: "https://registry.npmjs.org",
    npmDownloadsBase: "https://api.npmjs.org",
    pagesBase: "https://thanhnguyxnorg.github.io",
    token: process.env.GITHUB_TOKEN,
    outPath,
    contentDir: "src/content/repos",
    prevNpm,
  }).then(
    (out) => {
      for (const w of out.warnings) console.log(w);
      console.log(`baked ${out.data.repos.length} repos, ${out.requests} GitHub calls, changed=${out.changed}`);
    },
    (err) => {
      console.error(`FATAL ${(err as Error).message}`);
      process.exit(1);
    },
  );
}
