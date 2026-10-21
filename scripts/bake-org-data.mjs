#!/usr/bin/env node
/**
 * Zero-Touch Organization Telemetry & Smart Asset Baker (scripts/bake-org-data.mjs)
 *
 * 1. Fetches all public repositories from https://api.github.com/orgs/ThanhNguyxnOrg/repos
 * 2. Deduplicates repositories by canonical key (case/hyphen/underscore insensitive)
 * 3. Scans /public/brand/ and /public/logos/ with fuzzy matching (supports .png, .svg, .webp, .jpg, .jpeg, .avif,
 *    uppercase/lowercase, hyphens/underscores, and optional suffixes like -theme, -cover, -banner, -logo, -icon)
 * 4. Fetches 30-day downloads & latest versions from the npm Registry
 * 5. Writes the verified, deduplicated snapshot to src/data/liveSnapshot.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT_DIR, 'src', 'data', 'liveSnapshot.json');
const BRAND_DIR = path.join(ROOT_DIR, 'public', 'brand');
const LOGOS_DIR = path.join(ROOT_DIR, 'public', 'logos');

const ORG_NAME = 'ThanhNguyxnOrg';
const NPM_PACKAGES = ['archpulse', 'production-backend-kit'];
const IMAGE_EXTS = ['.png', '.svg', '.webp', '.jpg', '.jpeg', '.avif'];
const OPTIONAL_SUFFIXES = [
  '-theme',
  '_theme',
  '-cover',
  '_cover',
  '-banner',
  '_banner',
  '-card',
  '_card',
  '-logo',
  '_logo',
  '-icon',
  '_icon',
];

function compactKey(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/^thanhnguyxnorg\//, '')
    .replace(/[^a-z0-9.]+/g, '')
    .replace(/^\.+|\.+$/g, '');
}

function stripOptionalSuffix(stem) {
  let clean = stem.toLowerCase();
  for (const suffix of OPTIONAL_SUFFIXES) {
    if (clean.endsWith(suffix) && clean.length > suffix.length) {
      clean = clean.slice(0, -suffix.length);
      break;
    }
  }
  return clean;
}

export function isValidLiveDemoUrl(repoName, homepage, hasPages) {
  if (!homepage || typeof homepage !== 'string') return false;
  const trimmed = homepage.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;
  const lower = trimmed.toLowerCase();

  // A link back to github.com (repo root, #readme, /releases) is source/docs, not a live web demo
  if (lower.includes('github.com/')) return false;

  // For github.io links, verify GitHub Pages is actually enabled (and non-root repos have a path)
  if (lower.includes('thanhnguyxnorg.github.io')) {
    if (!hasPages) return false;
    const isRootRepo = repoName.toLowerCase() === 'thanhnguyxnorg.github.io';
    if (!isRootRepo) {
      const urlPath = lower.replace(/^https?:\/\/thanhnguyxnorg\.github\.io\/?/, '');
      if (!urlPath) return false;
    }
    return true;
  }

  return true;
}

async function fetchJson(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ThanhNguyxnOrg-ZeroTouch-Baker/3.0',
        ...headers,
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function scanDirectoryFiles(dirPath) {
  try {
    const entries = await fs.readdir(dirPath);
    return entries.filter((f) => !f.startsWith('.'));
  } catch {
    return [];
  }
}

/**
 * Fuzzy asset matcher:
 * Matches regardless of uppercase/lowercase, '-' vs '_', extension (.png/.svg/.webp/.jpg/.jpeg/.avif),
 * or optional suffixes (-theme, -cover, -banner, -logo, -icon).
 */
function findMatchingAsset(files, repoName, baseUrlPath, kind = 'brand') {
  const lowerName = repoName.toLowerCase();

  // Meta repositories fallback to org brand cover & logo if no dedicated file is dropped
  if (lowerName === '.github' || lowerName === 'thanhnguyxnorg.github.io') {
    if (kind === 'brand' && files.some((f) => f.toLowerCase() === 'org-github.png')) {
      return '/brand/org-github.png';
    }
    if (kind === 'logo') {
      return '/logo.png';
    }
  }

  // Pass 1: Exact case-insensitive stem match in priority extension order
  for (const ext of IMAGE_EXTS) {
    const exactTarget = `${lowerName}${ext}`;
    const match = files.find((f) => f.toLowerCase() === exactTarget);
    if (match) {
      return `${baseUrlPath}/${match}`;
    }
  }

  // Pass 2: Compact alphanumeric + optional suffix fuzzy match
  const targetCompact = compactKey(repoName).replace(/\./g, '');
  if (!targetCompact) return null;

  for (const ext of IMAGE_EXTS) {
    const match = files.find((file) => {
      const lowerFile = file.toLowerCase();
      if (!lowerFile.endsWith(ext)) return false;
      const stem = lowerFile.slice(0, -ext.length);
      const strippedStem = stripOptionalSuffix(stem);
      const fileCompact = compactKey(strippedStem).replace(/\./g, '');
      return fileCompact === targetCompact;
    });
    if (match) {
      return `${baseUrlPath}/${match}`;
    }
  }

  return null;
}

async function run() {
  console.log(`[Zero-Touch Sync] Fetching live telemetry for ${ORG_NAME}...`);

  let existingSnapshot = null;
  try {
    const raw = await fs.readFile(OUTPUT_PATH, 'utf8');
    existingSnapshot = JSON.parse(raw);
  } catch {
    // First run
  }

  const brandFiles = await scanDirectoryFiles(BRAND_DIR);
  const logoFiles = await scanDirectoryFiles(LOGOS_DIR);

  const ghHeaders = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  let repos = existingSnapshot?.repos ?? [];
  try {
    const liveRepos = await fetchJson(
      `https://api.github.com/orgs/${ORG_NAME}/repos?per_page=100&sort=pushed`,
      ghHeaders,
    );
    if (Array.isArray(liveRepos) && liveRepos.length > 0) {
      const seenKeys = new Set();
      repos = [];

      for (const r of liveRepos) {
        if (!r || !r.name || r.archived) continue;
        const dedupeKey = compactKey(r.name);
        if (seenKeys.has(dedupeKey)) continue;
        seenKeys.add(dedupeKey);

        const slug = r.name.toLowerCase();
        const detectedBrand = findMatchingAsset(brandFiles, r.name, '/brand', 'brand');
        const detectedLogo = findMatchingAsset(logoFiles, r.name, '/logos', 'logo');

        repos.push({
          name: r.name,
          slug,
          description: r.description ?? '',
          html_url: r.html_url,
          homepage: r.homepage ?? null,
          language: r.language ?? 'TypeScript',
          stargazers_count: r.stargazers_count ?? 0,
          forks_count: r.forks_count ?? 0,
          open_issues_count: r.open_issues_count ?? 0,
          has_pages: Boolean(r.has_pages),
          topics: Array.isArray(r.topics) ? r.topics : [],
          created_at: r.created_at,
          updated_at: r.updated_at,
          pushed_at: r.pushed_at,
          default_branch: r.default_branch ?? 'main',
          license: r.license?.spdx_id ? { spdx_id: r.license.spdx_id } : null,
          archived: Boolean(r.archived),
          image: detectedBrand,
          logo: detectedLogo,
        });
      }

      console.log(
        `[Zero-Touch Sync] Synced ${repos.length} unique public repositories (matched ${repos.filter((r) => r.image).length} brand covers & ${repos.filter((r) => r.logo).length} logos).`,
      );
    }
  } catch (err) {
    console.warn(
      `[Zero-Touch Sync] GitHub API warning (${err.message}), keeping existing repo list.`,
    );
  }

  const npmStats = { ...(existingSnapshot?.npmPackages ?? {}) };
  for (const pkg of NPM_PACKAGES) {
    try {
      const [dlData, metaData] = await Promise.all([
        fetchJson(`https://api.npmjs.org/downloads/point/last-month/${pkg}`),
        fetchJson(`https://registry.npmjs.org/${pkg}/latest`),
      ]);
      npmStats[pkg] = {
        downloads:
          typeof dlData?.downloads === 'number'
            ? dlData.downloads
            : (npmStats[pkg]?.downloads ?? 0),
        version: metaData?.version
          ? `v${metaData.version.replace(/^v/, '')}`
          : (npmStats[pkg]?.version ?? 'v1.0.0'),
      };
      console.log(
        `[Zero-Touch Sync] Synced npm package ${pkg}: ${npmStats[pkg].version} (${npmStats[pkg].downloads} downloads/30d)`,
      );
    } catch (err) {
      console.warn(`[Zero-Touch Sync] npm API warning for ${pkg}: ${err.message}`);
    }
  }

  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
  const totalDemos = repos.filter((r) =>
    isValidLiveDemoUrl(r.name, r.homepage, r.has_pages),
  ).length;
  const totalDownloads = Object.values(npmStats).reduce(
    (sum, item) => sum + (item?.downloads || 0),
    0,
  );

  const snapshot = {
    syncedAt: new Date().toISOString().slice(0, 10),
    syncedIso: new Date().toISOString(),
    org: ORG_NAME,
    totals: {
      repos: repos.length,
      stars: totalStars,
      forks: totalForks,
      demos: totalDemos,
      packages: Object.keys(npmStats).length,
      downloads30d: totalDownloads,
    },
    npmPackages: npmStats,
    repos,
  };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  console.log(`[Zero-Touch Sync] Wrote verified snapshot to ${OUTPUT_PATH}`);
}

run().catch((err) => {
  console.error('[Zero-Touch Sync] Fatal error:', err);
  process.exit(1);
});
