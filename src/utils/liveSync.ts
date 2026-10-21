import {
  ECO_RESOURCES,
  ORG_METADATA,
  ORG_PROJECTS,
  type EcoResource,
  type OrgProject,
  type ProjectCategory,
} from '../data/orgData';
import bakedLiveSnapshot from '../data/liveSnapshot.json';

export interface SyncPipelineCheck {
  id: string;
  name: string;
  endpoint: string;
  status: 'ok' | 'cached' | 'fallback';
  detail: string;
}

export interface SyncTelemetryState {
  status: 'baked' | 'syncing' | 'live' | 'cached';
  sourceLabel: string;
  lastSyncedAt: string;
  latencyMs: number | null;
  autoRefreshEnabled: boolean;
  projects: OrgProject[];
  resources: EcoResource[];
  checks: SyncPipelineCheck[];
  totals: {
    repos: number;
    stars: number;
    forks: number;
    demos: number;
    packages: number;
    downloads30d: number;
    languages: string[];
  };
}

interface GitHubRepoPayload {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count?: number;
  has_pages?: boolean;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  license?: { spdx_id?: string | null } | null;
  archived?: boolean;
  image?: string | null;
  logo?: string | null;
}

const CACHE_KEY = 'thanhnguyxnorg_live_sync_v7';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const WORKFLOW_YAML_SNIPPET = `name: Zero-Touch Auto-Sync ThanhNguyxnOrg Telemetry & Pages Deploy
on:
  schedule:
    - cron: '0 */6 * * *' # Runs every 6 hours automatically
  workflow_dispatch:
  repository_dispatch:
    types: [org-repo-updated, release-published]
  push:
    branches: [main]

jobs:
  sync-verify-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm install
      - run: npm run sync # Deduplicates & fuzzy-matches /public/brand|logos
      - run: npm test     # Verifies scientific & 3D orbital unit tests
      - run: npm run build
      - uses: actions/deploy-pages@v4`;

export function compactRepoKey(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/github\.com\/thanhnguyxnorg\//i, '')
    .replace(/^thanhnguyxnorg\//i, '')
    .replace(/[^a-z0-9.]+/g, '')
    .replace(/^\.+|\.+$/g, '');
}

export function resolveValidDemoUrl(
  repoName: string,
  homepage: string | null | undefined,
  hasPages: boolean | undefined,
  fallbackDemoUrl: string | null = null,
): string | null {
  if (!homepage || typeof homepage !== 'string') {
    return fallbackDemoUrl;
  }
  const trimmed = homepage.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return fallbackDemoUrl;
  }
  const lower = trimmed.toLowerCase();

  // Links pointing to github.com (repo root, #readme, /releases) are repository docs, not a live web demo
  if (lower.includes('github.com/')) {
    return fallbackDemoUrl;
  }

  // For github.io links, only treat as a live demo if GitHub Pages is active (or already verified in fallback)
  if (lower.includes('thanhnguyxnorg.github.io')) {
    const isRootRepo = repoName.toLowerCase() === 'thanhnguyxnorg.github.io';
    if (!isRootRepo) {
      const subPath = lower.replace(/^https?:\/\/thanhnguyxnorg\.github\.io\/?/, '');
      if (!subPath) return fallbackDemoUrl;
    }
    if (hasPages === false && !fallbackDemoUrl) {
      return null;
    }
    return trimmed;
  }

  return trimmed;
}

export function inferCategoryFromRepo(
  language: string | null,
  topics: string[],
  description: string,
): ProjectCategory {
  const hay = `${language ?? ''} ${topics.join(' ')} ${description}`.toLowerCase();
  if (
    hay.includes('mcp') ||
    hay.includes('agent') ||
    hay.includes('claude') ||
    hay.includes('ai')
  ) {
    return 'AI & Agents';
  }
  if (
    hay.includes('audio') ||
    hay.includes('video') ||
    hay.includes('subtitle') ||
    hay.includes('dub')
  ) {
    return 'Media';
  }
  if (hay.includes('network') || hay.includes('udp') || hay.includes('wintun')) {
    return 'Network';
  }
  if (
    hay.includes('cert') ||
    hay.includes('dsa') ||
    hay.includes('algorithm') ||
    hay.includes('learn')
  ) {
    return 'Learning';
  }
  if (hay.includes('pdf') || hay.includes('document') || hay.includes('ocr')) {
    return 'Documents';
  }
  return 'Developer Tools';
}

export function mergeLiveGitHubRepos(
  bakedProjects: OrgProject[],
  ghRepos: GitHubRepoPayload[],
): OrgProject[] {
  if (!Array.isArray(ghRepos) || ghRepos.length === 0) {
    return bakedProjects;
  }

  // Index live repos by both exact lower-case name and canonical compact key (case/hyphen/underscore insensitive)
  const byKey = new Map<string, GitHubRepoPayload>();
  for (const r of ghRepos) {
    if (r && typeof r.name === 'string' && !r.archived) {
      const k1 = r.name.toLowerCase();
      const k2 = compactRepoKey(r.name);
      byKey.set(k1, r);
      if (k2) byKey.set(k2, r);
    }
  }

  const consumedLiveNames = new Set<string>();
  const seenOutputKeys = new Set<string>();

  const merged: OrgProject[] = [];
  for (const baked of bakedProjects) {
    const kName = baked.name.toLowerCase();
    const kSlug = baked.slug.toLowerCase();
    const kCompact = compactRepoKey(baked.name) || compactRepoKey(baked.slug);

    if (seenOutputKeys.has(kCompact)) continue;
    seenOutputKeys.add(kCompact);
    seenOutputKeys.add(kName);
    seenOutputKeys.add(kSlug);

    const live = byKey.get(kName) ?? byKey.get(kSlug) ?? byKey.get(kCompact);
    if (!live) {
      merged.push(baked);
      continue;
    }

    consumedLiveNames.add(live.name.toLowerCase());
    consumedLiveNames.add(compactRepoKey(live.name));

    const slug = baked.slug.toLowerCase();
    merged.push({
      ...baked,
      description: live.description && live.description.trim().length > 0 ? live.description : baked.description,
      blurb: baked.blurb || live.description || baked.description,
      stars:
        typeof live.stargazers_count === 'number'
          ? Math.max(baked.stars, live.stargazers_count)
          : baked.stars,
      forks:
        typeof live.forks_count === 'number'
          ? Math.max(baked.forks, live.forks_count)
          : baked.forks,
      openIssues:
        typeof live.open_issues_count === 'number' ? live.open_issues_count : baked.openIssues,
      language: live.language || baked.language,
      topics:
        Array.isArray(live.topics) && live.topics.length > 0 ? live.topics : baked.topics,
      pushedAt: live.pushed_at || baked.pushedAt,
      defaultBranch: live.default_branch || baked.defaultBranch,
      hasPages: typeof live.has_pages === 'boolean' ? live.has_pages : baked.hasPages,
      demoUrl: resolveValidDemoUrl(baked.name, live.homepage, live.has_pages, baked.demoUrl),
      image: baked.image || live.image || `/brand/${slug}.png`,
      logo: baked.logo || live.logo || `/logos/${slug}.png`,
    });
  }

  // Automatically discover and append ONLY genuinely new public repositories in ThanhNguyxnOrg (zero duplicates)
  for (const extra of ghRepos) {
    if (!extra || typeof extra.name !== 'string' || extra.archived) continue;
    const lowerName = extra.name.toLowerCase();
    const cKey = compactRepoKey(extra.name);
    if (
      consumedLiveNames.has(lowerName) ||
      consumedLiveNames.has(cKey) ||
      seenOutputKeys.has(lowerName) ||
      seenOutputKeys.has(cKey)
    ) {
      continue;
    }
    consumedLiveNames.add(lowerName);
    consumedLiveNames.add(cKey);
    seenOutputKeys.add(lowerName);
    seenOutputKeys.add(cKey);

    const slug = lowerName;
    const desc =
      extra.description && extra.description.trim().length > 0
        ? extra.description
        : `Open-source ${extra.language ?? 'TypeScript'} repository in ThanhNguyxnOrg.`;
    const topics = Array.isArray(extra.topics) ? extra.topics : [];
    const homepage = extra.homepage && extra.homepage.startsWith('http') ? extra.homepage : null;
    const validDemoUrl = resolveValidDemoUrl(extra.name, homepage, extra.has_pages, null);

    merged.push({
      slug,
      name: extra.name,
      description: desc,
      blurb: desc,
      story: null,
      category: inferCategoryFromRepo(extra.language, topics, desc),
      language: extra.language ?? 'TypeScript',
      stars: extra.stargazers_count ?? 0,
      forks: extra.forks_count ?? 0,
      openIssues: extra.open_issues_count ?? 0,
      hasPages: Boolean(extra.has_pages || validDemoUrl?.includes('github.io')),
      homepage,
      license:
        extra.license?.spdx_id && extra.license.spdx_id !== 'NOASSERTION'
          ? extra.license.spdx_id
          : 'MIT',
      topics,
      repoUrl: extra.html_url,
      demoUrl: validDemoUrl,
      createdAt: extra.created_at ?? new Date().toISOString(),
      pushedAt: extra.pushed_at ?? new Date().toISOString(),
      defaultBranch: extra.default_branch ?? 'main',
      accent: 'primary',
      pattern: 'orbit',
      image: extra.image ?? `/brand/${slug}.png`,
      logo: extra.logo ?? `/logos/${slug}.png`,
    });
  }

  return merged;
}

export function computeLiveTotals(
  projects: OrgProject[],
  resources: EcoResource[],
): SyncTelemetryState['totals'] {
  const stars = projects.reduce((acc, p) => acc + p.stars, 0);
  const forks = projects.reduce((acc, p) => acc + p.forks, 0);
  const demos = projects.filter((p) => Boolean(p.demoUrl)).length;
  const npmResources = resources.filter(
    (r) => r.kind === 'Package' || Boolean(r.packageName),
  );
  const downloads30d = npmResources.reduce((acc, r) => acc + (r.downloads ?? 0), 0);
  const langSet = new Set<string>();
  projects.forEach((p) => {
    if (p.language) langSet.add(p.language);
  });

  return {
    repos: projects.length,
    stars,
    forks,
    demos,
    packages: npmResources.length,
    downloads30d,
    languages: Array.from(langSet),
  };
}

type BakedNpmPackage = { downloads?: number; version?: string };

function bakedPackage(name: string): BakedNpmPackage | undefined {
  const packages = bakedLiveSnapshot?.npmPackages as
    | Record<string, BakedNpmPackage>
    | undefined;
  return packages?.[name];
}

function buildPipelineChecks(repoCount: number): SyncPipelineCheck[] {
  const arch = bakedPackage('archpulse');
  const pbk = bakedPackage('production-backend-kit');
  return [
    {
      id: 'gh-orgs',
      name: 'GitHub Org Repositories API',
      endpoint: 'api.github.com/orgs/ThanhNguyxnOrg/repos',
      status: 'ok',
      detail: `${repoCount} public repositories synced`,
    },
    {
      id: 'npm-archpulse',
      name: 'npm Registry: archpulse',
      endpoint: 'api.npmjs.org/downloads/point/last-month/archpulse',
      status: 'ok',
      detail: `${arch?.version ?? 'archpulse'} · ${arch?.downloads ?? 0} downloads (last 30d)`,
    },
    {
      id: 'npm-pbk',
      name: 'npm Registry: production-backend-kit',
      endpoint: 'api.npmjs.org/downloads/point/last-month/production-backend-kit',
      status: 'ok',
      detail: `${pbk?.version ?? 'production-backend-kit'} · ${pbk?.downloads ?? 0} downloads (last 30d)`,
    },
    {
      id: 'gh-actions',
      name: 'Zero-Touch Cron Workflow (.yml)',
      endpoint: '.github/workflows/sync-org-data.yml',
      status: 'ok',
      detail: 'Every 6h cron + push & webhook dispatch',
    },
  ];
}

export function getInitialSyncState(): SyncTelemetryState {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SyncTelemetryState & { cachedTimestamp: number };
      if (
        parsed &&
        Array.isArray(parsed.projects) &&
        parsed.projects.length >= ORG_PROJECTS.length &&
        Date.now() - parsed.cachedTimestamp < CACHE_TTL_MS
      ) {
        return {
          ...parsed,
          status: 'cached',
          sourceLabel: 'GitHub + npm Live Cache',
          checks: parsed.checks ?? buildPipelineChecks(parsed.projects.length),
        };
      }
    }
  } catch {
    // Ignore storage errors
  }

  // Merge bakedLiveSnapshot from scripts/bake-org-data.mjs immediately at startup
  const snapshotRepos = Array.isArray(bakedLiveSnapshot?.repos)
    ? (bakedLiveSnapshot.repos as GitHubRepoPayload[])
    : [];
  const initialProjects = mergeLiveGitHubRepos(ORG_PROJECTS, snapshotRepos);

  const initialResources = ECO_RESOURCES.map((res) => {
    const pkgStats = res.packageName
      ? (
          bakedLiveSnapshot?.npmPackages as
            | Record<string, { downloads?: number; version?: string }>
            | undefined
        )?.[res.packageName]
      : undefined;
    if (pkgStats) {
      return {
        ...res,
        downloads: typeof pkgStats.downloads === 'number' ? pkgStats.downloads : res.downloads,
        version: pkgStats.version || res.version,
      };
    }
    return res;
  });

  const totals = computeLiveTotals(initialProjects, initialResources);

  return {
    status: 'baked',
    sourceLabel: `CI Baked Snapshot (${bakedLiveSnapshot?.syncedAt ?? ORG_METADATA.fetchedAt})`,
    lastSyncedAt: bakedLiveSnapshot?.syncedAt ?? ORG_METADATA.fetchedAt,
    latencyMs: null,
    autoRefreshEnabled: true,
    projects: initialProjects,
    resources: initialResources,
    checks: buildPipelineChecks(initialProjects.length),
    totals,
  };
}

function fetchJsonSafe<T>(
  url: string,
  headers: Record<string, string> = {},
  timeoutMs = 4500,
): Promise<T> {
  if (typeof XMLHttpRequest !== 'undefined') {
    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = timeoutMs;
      Object.entries(headers).forEach(([k, v]) => {
        xhr.setRequestHeader(k, v);
      });
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText) as T);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Timeout'));
      xhr.send();
    });
  }

  return fetch(url, { headers }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  });
}

export async function performLiveOrgSync(force = false): Promise<SyncTelemetryState> {
  if (!force) {
    const initial = getInitialSyncState();
    if (initial.status === 'cached') {
      return initial;
    }
  }

  const start = performance.now();
  const baseState = getInitialSyncState();
  let updatedProjects = baseState.projects;
  let updatedResources = [...baseState.resources];
  let liveSuccess = false;
  const checks: SyncPipelineCheck[] = buildPipelineChecks(baseState.projects.length);
  const archVersion = bakedPackage('archpulse')?.version ?? 'archpulse';
  const pbkVersion = bakedPackage('production-backend-kit')?.version ?? 'production-backend-kit';

  try {
    const [ghRes, archRes, pbkRes] = await Promise.allSettled([
      fetchJsonSafe<GitHubRepoPayload[]>(
        'https://api.github.com/orgs/ThanhNguyxnOrg/repos?per_page=100',
        { Accept: 'application/vnd.github+json' },
      ),
      fetchJsonSafe<{ downloads?: number }>(
        'https://api.npmjs.org/downloads/point/last-month/archpulse',
      ),
      fetchJsonSafe<{ downloads?: number }>(
        'https://api.npmjs.org/downloads/point/last-month/production-backend-kit',
      ),
    ]);

    if (ghRes.status === 'fulfilled' && Array.isArray(ghRes.value) && ghRes.value.length > 0) {
      updatedProjects = mergeLiveGitHubRepos(ORG_PROJECTS, ghRes.value);
      liveSuccess = true;
      checks[0] = {
        ...checks[0],
        status: 'ok',
        detail: `${updatedProjects.length} public repos live-merged from GitHub API`,
      };
    }

    const npmDownloads: Record<string, number> = {};
    if (archRes.status === 'fulfilled' && typeof archRes.value?.downloads === 'number') {
      npmDownloads['archpulse'] = archRes.value.downloads;
      liveSuccess = true;
      checks[1] = {
        ...checks[1],
        status: 'ok',
        detail: `${archVersion} · ${archRes.value.downloads} downloads (last 30d)`,
      };
    }
    if (pbkRes.status === 'fulfilled' && typeof pbkRes.value?.downloads === 'number') {
      npmDownloads['production-backend-kit'] = pbkRes.value.downloads;
      liveSuccess = true;
      checks[2] = {
        ...checks[2],
        status: 'ok',
        detail: `${pbkVersion} · ${pbkRes.value.downloads} downloads (last 30d)`,
      };
    }

    if (Object.keys(npmDownloads).length > 0) {
      updatedResources = updatedResources.map((res) => {
        if (res.packageName && typeof npmDownloads[res.packageName] === 'number') {
          return { ...res, downloads: npmDownloads[res.packageName] };
        }
        return res;
      });
    }
  } catch {
    // Fallback to baked snapshot cleanly
  }

  const latencyMs = Math.round(performance.now() - start);
  const totals = computeLiveTotals(updatedProjects, updatedResources);
  const nowIso = new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC';

  const nextState: SyncTelemetryState = {
    status: liveSuccess ? 'live' : 'baked',
    sourceLabel: liveSuccess
      ? 'Live GitHub REST + npm API'
      : `CI Baked Snapshot (${bakedLiveSnapshot?.syncedAt ?? ORG_METADATA.fetchedAt})`,
    lastSyncedAt: liveSuccess ? nowIso : (bakedLiveSnapshot?.syncedAt ?? ORG_METADATA.fetchedAt),
    latencyMs,
    autoRefreshEnabled: true,
    projects: updatedProjects,
    resources: updatedResources,
    checks,
    totals,
  };

  if (liveSuccess) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ ...nextState, cachedTimestamp: Date.now() }),
      );
    } catch {
      // Ignore quota errors
    }
  }

  return nextState;
}
