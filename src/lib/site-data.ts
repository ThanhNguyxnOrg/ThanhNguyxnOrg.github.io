import { getCollection } from 'astro:content';
import { loadBaked } from './baked';
import { joinProjects } from './projects';
import type { EcoResource } from '../sections/Ecosystem';
import bakedRaw from '../data/baked.json';

/** Single source of page data: baked numbers joined with hand-written voice. */
export async function loadSiteData() {
  const baked = loadBaked(bakedRaw);
  const repoEntries = await getCollection('repos');
  const projects = joinProjects(
    baked,
    repoEntries.map((e) => ({ slug: e.id, data: e.data })),
  );
  const stops = (await getCollection('timeline'))
    .map((e) => ({
      date: e.data.date,
      title: e.data.title,
      description: e.data.description,
      tags: e.data.tags,
      current: e.data.current,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const resources: EcoResource[] = [
    {
      kind: 'Organization',
      label: 'ThanhNguyxnOrg on GitHub',
      description: 'Home of every TNORG repository, issue tracker and discussion.',
      url: 'https://github.com/ThanhNguyxnOrg',
    },
    ...baked.npm.map((p) => ({
      kind: 'Package' as const,
      label: p.name,
      version: `v${p.version}`,
      downloads: p.downloads30d,
      package: p.name,
      description: p.description,
      url: `https://www.npmjs.com/package/${p.name}`,
    })),
    {
      kind: 'Resource',
      label: 'Control room',
      description: 'Org profile and community files: contributing, support and security notes.',
      url: 'https://github.com/ThanhNguyxnOrg/.github',
    },
    {
      kind: 'Bot' as const,
      label: 'ThanhNguyxnAgent',
      description: 'GitHub App running releases and repository automation.',
      url: 'https://github.com/apps/thanhnguyxnagent',
    },
    {
      kind: 'People',
      label: 'RealThanhNguyxn',
      description: 'Organization member.',
      url: 'https://github.com/RealThanhNguyxn',
    },
    {
      kind: 'People',
      label: 'ThanhNguyxn07',
      description: 'Organization member.',
      url: 'https://github.com/ThanhNguyxn07',
    },
  ];

  return { baked, projects, stops, resources };
}
