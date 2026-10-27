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
} from './projectLogic';
import { mergeLiveGitHubRepos } from './liveSync';

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
  assert.equal(aiProjects.length, 3);
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
