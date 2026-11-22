import test from 'node:test';
import assert from 'node:assert/strict';
import { ORG_PROJECTS, ORG_METADATA } from '../data/orgData';
import {
  assessProjectScientifically,
  filterAndSortProjects,
  groupProjectsByCluster,
  computeLanguageBreakdown,
  computeTopicCounts,
  computeOrbitalPositions,
  paginateItems,
} from './projectLogic';
import { mergeLiveGitHubRepos } from './liveSync';
import { supportsWebGL, createRendererOrFallback } from './webgl';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import OrbitalScene3D from '../components/OrbitalScene3D';

test('WebGL detection handles missing, blocked, and supported contexts', () => {
  assert.equal(supportsWebGL(() => null), false);
  assert.equal(supportsWebGL(() => { throw new Error('blocked'); }), false);
  for (const supported of ['webgl2', 'webgl', 'experimental-webgl']) {
    assert.equal(supportsWebGL((name) => name === supported ? { getExtension: () => null } : null), true);
  }
});

test('renderer selection skips unsupported WebGL and catches initialization failures', () => {
  let calls = 0;
  const create = () => { calls++; return { renderer: true }; };
  assert.equal(createRendererOrFallback(false, create), null);
  assert.equal(calls, 0);
  assert.deepEqual(createRendererOrFallback(true, create), { renderer: true });
  assert.equal(createRendererOrFallback(true, () => { throw new Error('GPU unavailable'); }), null);
});

test('without WebGL the initial render lists the same repositories, including an empty state', () => {
  const render = (projects: typeof ORG_PROJECTS) => renderToStaticMarkup(createElement(OrbitalScene3D, {
    projects, selectedSlug: projects[0]?.slug ?? '', onSelectProject: () => {}, onOpenDossier: () => {},
  }));
  const markup = render(ORG_PROJECTS);
  assert.match(markup, /orbital-2d-viewport/);
  assert.doesNotMatch(markup, /orbital-3d-viewport/);
  for (const project of ORG_PROJECTS) assert.ok(markup.includes(project.name));
  assert.match(markup, /aria-pressed="true"/);
  assert.match(markup, /Open dossier/);
  assert.match(render([]), /No repositories to display/);
});

test('dataset integrity matches baked totals', () => {
  assert.equal(ORG_PROJECTS.length, ORG_METADATA.totals.repos);

  const totalStars = ORG_PROJECTS.reduce((acc, p) => acc + p.stars, 0);
  assert.equal(totalStars, ORG_METADATA.totals.stars);

  const totalDemos = ORG_PROJECTS.filter((p) => Boolean(p.demoUrl)).length;
  assert.equal(totalDemos, ORG_METADATA.totals.demos);
});

test('filterAndSortProjects filters by category and search query accurately', () => {
  const aiProjects = filterAndSortProjects(ORG_PROJECTS, {
    query: '',
    category: 'AI & Agents',
    topics: [],
    sort: 'stars',
  });
  const expectedAiCount = ORG_PROJECTS.filter((p) => p.category === 'AI & Agents').length;
  assert.equal(aiProjects.length, expectedAiCount);
  assert.equal(aiProjects[0].name, 'blendops');

  const rustQuery = filterAndSortProjects(ORG_PROJECTS, {
    query: 'rust',
    category: 'all',
    topics: [],
    sort: 'stars',
  });
  assert.ok(rustQuery.some((p) => p.name === 'PurgeKit'));
});

test('filterAndSortProjects supports scientific impact sort, live demo filter, and A-Z sorting', () => {
  const scientificSorted = filterAndSortProjects(ORG_PROJECTS, {
    query: '',
    category: 'all',
    topics: [],
    sort: 'scientific',
  });
  assert.equal(scientificSorted.length, ORG_PROJECTS.length);
  const firstScore = assessProjectScientifically(scientificSorted[0]).score;
  const lastScore = assessProjectScientifically(
    scientificSorted[scientificSorted.length - 1],
  ).score;
  assert.ok(firstScore >= lastScore);

  const demos = filterAndSortProjects(ORG_PROJECTS, {
    query: '',
    category: 'all',
    topics: [],
    onlyLiveDemos: true,
    sort: 'az',
  });
  const expectedDemos = ORG_PROJECTS.filter((project) => Boolean(project.demoUrl)).length;
  assert.equal(demos.length, expectedDemos);
  assert.equal(demos[0].name, 'apidex-hub');
});

test('groupProjectsByCluster partitions all repositories into 4 logical engineering clusters', () => {
  const clusters = groupProjectsByCluster(ORG_PROJECTS);
  assert.equal(clusters.length, 4);
  const totalInClusters = clusters.reduce((sum, c) => sum + c.items.length, 0);
  assert.equal(totalInClusters, ORG_PROJECTS.length);
});

test('mergeLiveGitHubRepos updates stars, preserves curated story, and never duplicates existing repos', () => {
  const updated = mergeLiveGitHubRepos(ORG_PROJECTS, [
    {
      name: 'blendops',
      description: 'Updated description',
      html_url: 'https://github.com/ThanhNguyxnOrg/blendops',
      homepage: 'https://github.com/ThanhNguyxnOrg/blendops',
      language: 'JavaScript',
      stargazers_count: 12,
      forks_count: 3,
      topics: ['blender', 'mcp'],
      created_at: '2026-04-06T09:50:48Z',
      updated_at: '2026-10-20T00:00:00Z',
      pushed_at: '2026-10-20T00:00:00Z',
      default_branch: 'main',
    },
    // Different casing / separator variation of an existing repo must NOT create a duplicate
    {
      name: 'Git_Account_Switcher',
      description: 'Same repo with underscores',
      html_url: 'https://github.com/ThanhNguyxnOrg/git-account-switcher',
      homepage: null,
      language: 'PowerShell',
      stargazers_count: 4,
      forks_count: 1,
      topics: ['git'],
      created_at: '2026-09-16T01:59:30Z',
      updated_at: '2026-10-20T00:00:00Z',
      pushed_at: '2026-10-20T00:00:00Z',
      default_branch: 'master',
    },
    // Brand-new repository created in ThanhNguyxnOrg must be appended once with auto-bound assets
    {
      name: 'NovaEngine',
      description: 'Next-gen spatial compute toolkit',
      html_url: 'https://github.com/ThanhNguyxnOrg/NovaEngine',
      homepage: 'https://thanhnguyxnorg.github.io/NovaEngine/',
      has_pages: true,
      language: 'Rust',
      stargazers_count: 7,
      forks_count: 1,
      topics: ['rust', 'ai'],
      created_at: '2026-10-21T00:00:00Z',
      updated_at: '2026-10-21T00:00:00Z',
      pushed_at: '2026-10-21T00:00:00Z',
      default_branch: 'main',
    },
  ]);

  // Existing curated repositories + 1 brand-new = zero duplicates
  assert.equal(updated.length, ORG_PROJECTS.length + 1);

  const originalBlendops = ORG_PROJECTS.find((p) => p.slug === 'blendops')!;
  const blendops = updated.find((p) => p.slug === 'blendops')!;
  assert.equal(blendops.stars, 12);
  assert.equal(blendops.forks, 3);
  // Self-referential github.com homepage should not become a fake demoUrl
  assert.equal(blendops.demoUrl, null);
  assert.ok(blendops.story && blendops.story.length > 10);
  // A shorter live description must not overwrite richer curated copy
  assert.equal(blendops.description, originalBlendops.description);

  const switcherMatches = updated.filter((p) => p.slug === 'git-account-switcher');
  assert.equal(switcherMatches.length, 1);
  assert.equal(switcherMatches[0].stars, 4);

  const nova = updated.find((p) => p.slug === 'novaengine')!;
  assert.equal(nova.name, 'NovaEngine');
  assert.equal(nova.image, '/brand/novaengine.png');
  assert.equal(nova.logo, '/logos/novaengine.png');
  assert.equal(nova.demoUrl, 'https://thanhnguyxnorg.github.io/NovaEngine/');
});

test('mergeLiveGitHubRepos preserves identified licences and labels undetermined licences honestly', () => {
  const cases = [
    { license: null, expected: 'Unknown' },
    { license: undefined, expected: 'Unknown' },
    { license: {}, expected: 'Unknown' },
    { license: { spdx_id: null }, expected: 'Unknown' },
    { license: { spdx_id: '' }, expected: 'Unknown' },
    { license: { spdx_id: 'NOASSERTION' }, expected: 'Unknown' },
    { license: { spdx_id: 'other' }, expected: 'Unknown' },
    { license: { spdx_id: 'MIT' }, expected: 'MIT' },
    { license: { spdx_id: 'Apache-2.0' }, expected: 'Apache-2.0' },
  ];

  for (const { license, expected } of cases) {
    const projects = mergeLiveGitHubRepos([], [{
      name: 'NewRepo',
      description: null,
      html_url: 'https://github.com/ThanhNguyxnOrg/NewRepo',
      homepage: null,
      language: null,
      stargazers_count: 0,
      forks_count: 0,
      created_at: '2026-10-21T00:00:00Z',
      updated_at: '2026-10-21T00:00:00Z',
      pushed_at: '2026-10-21T00:00:00Z',
      default_branch: 'main',
      license,
    }]);

    assert.equal(projects.length, 1);
    assert.equal(projects[0].license, expected, JSON.stringify(license));
  }
});

test('computeLanguageBreakdown calculates accurate counts and relative percentages', () => {
  const breakdown = computeLanguageBreakdown(ORG_PROJECTS);
  const expectedTypeScript = ORG_PROJECTS.filter(
    (project) => project.language === 'TypeScript',
  ).length;
  assert.equal(breakdown[0].language, 'TypeScript');
  assert.equal(breakdown[0].count, expectedTypeScript);
  assert.equal(breakdown[0].percentage, 100);
});

test('computeTopicCounts ranks topics by frequency', () => {
  const topics = computeTopicCounts(ORG_PROJECTS);
  assert.ok(topics.length > 15);
  assert.ok(topics[0][1] >= topics[1][1]);
});

test('computeOrbitalPositions assigns non-overlapping 3D coordinates across 3 rings', () => {
  const normal = computeOrbitalPositions(ORG_PROJECTS, 0);
  const exploded = computeOrbitalPositions(ORG_PROJECTS, 1);

  assert.equal(normal.length, ORG_PROJECTS.length);
  assert.equal(exploded.length, ORG_PROJECTS.length);
  assert.ok(exploded[0].radius > normal[0].radius);
});

test('paginateItems slices cleanly and clamps bounds for 100+ repositories', () => {
  const hundred = Array.from({ length: 100 }, (_, i) => i + 1);
  const page1 = paginateItems(hundred, 1, 9);
  assert.equal(page1.items.length, 9);
  assert.equal(page1.totalPages, 12);
  assert.equal(page1.startIndex, 0);
  assert.equal(page1.endIndex, 9);

  const lastPage = paginateItems(hundred, 99, 9);
  assert.equal(lastPage.currentPage, 12);
  assert.deepEqual(lastPage.items, [100]);

  const empty = paginateItems([], 1, 9);
  assert.equal(empty.totalPages, 1);
  assert.equal(empty.items.length, 0);
  assert.equal(empty.startIndex, 0);
  assert.equal(empty.endIndex, 0);
});
