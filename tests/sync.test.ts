import { describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runSync } from "../scripts/sync.ts";

const ORG = "ThanhNguyxnOrg";
const NAMES = [
  ".github",
  "apidex-hub",
  "awesome-cert-sherpa",
  "blendops",
  "cogmint",
  "ForgeHelm",
  "git-account-switcher",
  "judgeloom-core",
  "lagvex",
  "LayoutLingua",
  "Locsight",
  "lumeo",
  "PurgeKit",
  "SkillGauge",
  "Snapbooth",
  "StepDSA",
];

function repoEntry(name: string, extra: Record<string, unknown> = {}) {
  return {
    name,
    description: `${name} description`,
    language: "TypeScript",
    license: { spdx_id: "MIT" },
    stargazers_count: 1,
    forks_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-10-10T00:00:00Z",
    default_branch: "main",
    has_pages: false,
    homepage: null,
    html_url: `https://github.com/${ORG}/${name}`,
    topics: ["developer-tools"],
    fork: false,
    ...extra,
  };
}

type Route = { status: number; body: unknown };

function startFixture(routes: Map<string, Route>, pagesLive: Set<string>) {
  const seen: string[] = [];
  const server = http.createServer((req, res) => {
    const url = req.url ?? "/";
    if (req.method === "HEAD") {
      const m = url.match(/^\/([^/]+)\/$/);
      res.writeHead(pagesLive.has(m?.[1] ?? "") ? 200 : 404);
      res.end();
      return;
    }
    seen.push(`${req.method} ${url}`);
    const route = routes.get(url);
    if (!route) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "no fixture" }));
      return;
    }
    res.writeHead(route.status, { "content-type": "application/json" });
    res.end(JSON.stringify(route.body));
  });
  return new Promise<{ base: string; seen: string[]; close: () => Promise<void> }>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolve({
        base: `http://127.0.0.1:${port}`,
        seen,
        close: () => new Promise<void>((done) => server.close(() => done())),
      });
    });
  });
}

function baseRoutes(extraRepos: Record<string, unknown>[] = [], lang403: string[] = []) {
  const routes = new Map<string, Route>();
  routes.set("/orgs/ThanhNguyxnOrg", {
    status: 200,
    body: { login: ORG, public_repos: 16, followers: 8 },
  });
  routes.set("/orgs/ThanhNguyxnOrg/repos?per_page=100", {
    status: 200,
    body: [...NAMES.map((n) => repoEntry(n)), ...extraRepos],
  });
  for (const n of NAMES) {
    routes.set(`/repos/ThanhNguyxnOrg/${encodeURIComponent(n)}/languages`, {
      status: lang403.includes(n) ? 403 : 200,
      body: lang403.includes(n) ? { message: "forbidden" } : { TypeScript: 100 },
    });
  }
  for (const pkg of ["archpulse", "production-backend-kit"]) {
    routes.set(`/${pkg}`, {
      status: 200,
      body: {
        name: pkg,
        "dist-tags": { latest: "1.0.0" },
        versions: { "1.0.0": { description: `${pkg} desc`, keywords: ["dev"] } },
      },
    });
    routes.set(`/downloads/point/last-month/${pkg}`, { status: 200, body: { downloads: 10, package: pkg } });
  }
  return routes;
}

function fakeContentDir(slugs: string[]) {
  const dir = mkdtempSync(join(tmpdir(), "content-"));
  for (const s of slugs) writeFileSync(join(dir, `${s}.md`), `---\nslug: ${s}\n---\n`);
  return dir;
}

describe("sync", () => {
  it("continues past a 403 languages endpoint with an unverified flag", async () => {
    const fx = await startFixture(baseRoutes([], [".github"]), new Set());
    try {
      const out = await runSync({
        apiBase: fx.base,
        npmRegistryBase: fx.base,
        npmDownloadsBase: fx.base,
        pagesBase: fx.base,
        contentDir: fakeContentDir(NAMES.map((n) => n.toLowerCase())),
      });
      const target = out.data.repos.find((r) => r.name === ".github");
      assert.ok(target?.unverified.includes("languages"));
      assert.ok(out.warnings.length > 0);
    } finally {
      await fx.close();
    }
  });

  it("warns on a repo name missing from the content dir", async () => {
    const ghost = repoEntry("ghost-repo");
    const fx = await startFixture(baseRoutes([ghost]), new Set());
    try {
      const out = await runSync({
        apiBase: fx.base,
        npmRegistryBase: fx.base,
        npmDownloadsBase: fx.base,
        pagesBase: fx.base,
        contentDir: fakeContentDir(NAMES.map((n) => n.toLowerCase())),
      });
      assert.ok(out.warnings.some((w) => w.includes("ghost-repo")));
    } finally {
      await fx.close();
    }
  });

  it("uses at most 40 GitHub calls for a full run", async () => {
    const fx = await startFixture(baseRoutes(), new Set());
    try {
      const out = await runSync({
        apiBase: fx.base,
        npmRegistryBase: fx.base,
        npmDownloadsBase: fx.base,
        pagesBase: fx.base,
        contentDir: fakeContentDir(NAMES.map((n) => n.toLowerCase())),
      });
      assert.ok(out.requests <= 40, `used ${out.requests} calls`);
      assert.equal(out.data.repos.length, 16);
    } finally {
      await fx.close();
    }
  });

  it("keeps previous npm numbers when the registry fails", async () => {
    const routes = baseRoutes();
    routes.set("/archpulse", { status: 500, body: {} });
    routes.set("/downloads/point/last-month/archpulse", { status: 500, body: {} });
    routes.set("/production-backend-kit", { status: 500, body: {} });
    routes.set("/downloads/point/last-month/production-backend-kit", { status: 500, body: {} });
    const fx = await startFixture(routes, new Set());
    const prevNpm = [
      { name: "archpulse", version: "0.5.3", description: "prev", keywords: [], downloads30d: 146 },
      { name: "production-backend-kit", version: "1.1.2", description: "prev", keywords: [], downloads30d: 167 },
    ];
    try {
      const out = await runSync({
        apiBase: fx.base,
        npmRegistryBase: fx.base,
        npmDownloadsBase: fx.base,
        pagesBase: fx.base,
        contentDir: fakeContentDir(NAMES.map((n) => n.toLowerCase())),
        prevNpm,
      });
      assert.equal(out.data.npm.length, 2);
      assert.equal(out.data.totals.downloads30d, 313);
      assert.ok(out.warnings.some((w) => w.includes("keeping previous")));
    } finally {
      await fx.close();
    }
  });
});
