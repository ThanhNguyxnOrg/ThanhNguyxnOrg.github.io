import type { OrgProject } from '../data/orgData';

export type SortOption = 'scientific' | 'stars' | 'recent' | 'az';

export interface FilterCriteria {
  query: string;
  category: string;
  topics: string[];
  onlyLiveDemos?: boolean;
  sort: SortOption;
}

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
}

export interface OrbitalNodePosition {
  slug: string;
  ringIndex: 0 | 1 | 2;
  angleRad: number;
  radius: number;
  x: number;
  yOffset: number;
  z: number;
  nodeScale: number;
}

export interface ScientificDimensions {
  traction: number;
  readiness: number;
  architecture: number;
  velocity: number;
}

export interface ScientificAssessment {
  score: number;
  tier: 'Tier I · Flagship' | 'Tier II · Production' | 'Tier III · Specialized';
  cluster:
    | 'AI & Agentic Workflows'
    | 'Systems, CLI & Network'
    | 'Media DSP & Creative Web'
    | 'Learning & Org Architecture';
  dimensions: ScientificDimensions;
}

/**
 * Computes a deterministic, transparent Engineering Index Score (58 - 99),
 * 4-dimensional sub-metrics, and scientific taxonomy cluster for a repository.
 */
export function assessProjectScientifically(project: OrgProject): ScientificAssessment {
  const tractionPoints = Math.min(34, project.stars * 9 + project.forks * 5);
  const deploymentPoints = project.demoUrl ? 16 : 0;
  const storyPoints = project.story ? 12 : 5;
  const topicPoints = Math.min(12, project.topics.length * 2);

  // Recency points (2026 pushes get high activity credit)
  const pushedMs = new Date(project.pushedAt).getTime();
  const refMs = new Date('2026-06-20T00:00:00Z').getTime();
  const daysDiff = Math.max(0, (refMs - pushedMs) / (1000 * 60 * 60 * 24));
  const recencyPoints = Math.max(6, Math.round(25 - Math.min(19, daysDiff * 0.4)));

  const rawScore =
    32 + tractionPoints + deploymentPoints + storyPoints + topicPoints + recencyPoints;
  const score = Math.max(58, Math.min(99, rawScore));

  const dimensions: ScientificDimensions = {
    traction: Math.min(99, Math.max(52, 48 + project.stars * 14 + project.forks * 8)),
    readiness: project.demoUrl ? 96 : 74,
    architecture: Math.min(
      99,
      Math.max(64, 58 + (project.story ? 22 : 8) + project.topics.length * 3),
    ),
    velocity: Math.min(99, Math.max(60, Math.round((recencyPoints / 25) * 98))),
  };

  const tier: ScientificAssessment['tier'] =
    score >= 86 || project.stars >= 2
      ? 'Tier I · Flagship'
      : score >= 74 || Boolean(project.demoUrl)
        ? 'Tier II · Production'
        : 'Tier III · Specialized';

  let cluster: ScientificAssessment['cluster'] = 'Systems, CLI & Network';
  if (project.category === 'AI & Agents') {
    cluster = 'AI & Agentic Workflows';
  } else if (
    project.category === 'Media' ||
    project.category === 'Documents' ||
    project.category === 'Web Apps'
  ) {
    cluster = 'Media DSP & Creative Web';
  } else if (project.category === 'Learning' || project.category === 'Meta') {
    cluster = 'Learning & Org Architecture';
  }

  return { score, tier, cluster, dimensions };
}

/**
 * Pure function to filter and sort organization projects.
 */
export function filterAndSortProjects(
  projects: OrgProject[],
  criteria: FilterCriteria,
): OrgProject[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();

  const filtered = projects.filter((project) => {
    if (criteria.category && criteria.category !== 'all') {
      if (project.category.toLowerCase() !== criteria.category.toLowerCase()) {
        return false;
      }
    }

    if (criteria.onlyLiveDemos && !project.demoUrl) {
      return false;
    }

    if (criteria.topics.length > 0) {
      const hasAllTopics = criteria.topics.every((t) =>
        project.topics.some((pt) => pt.toLowerCase() === t.toLowerCase()),
      );
      if (!hasAllTopics) return false;
    }

    if (normalizedQuery.length > 0) {
      const haystack = [
        project.name,
        project.description,
        project.blurb,
        project.story ?? '',
        project.language,
        project.category,
        ...project.topics,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    if (criteria.sort === 'scientific') {
      const scoreDiff =
        assessProjectScientifically(b).score - assessProjectScientifically(a).score;
      if (scoreDiff !== 0) return scoreDiff;
      if (b.stars !== a.stars) return b.stars - a.stars;
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
    }
    if (criteria.sort === 'stars') {
      if (b.stars !== a.stars) return b.stars - a.stars;
      if (b.forks !== a.forks) return b.forks - a.forks;
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
    }
    if (criteria.sort === 'recent') {
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Groups filtered projects into the 4 logical engineering clusters.
 */
export function groupProjectsByCluster(
  projects: OrgProject[],
): { cluster: ScientificAssessment['cluster']; items: OrgProject[] }[] {
  const order: ScientificAssessment['cluster'][] = [
    'AI & Agentic Workflows',
    'Systems, CLI & Network',
    'Media DSP & Creative Web',
    'Learning & Org Architecture',
  ];
  const map = new Map<ScientificAssessment['cluster'], OrgProject[]>();
  order.forEach((c) => map.set(c, []));

  projects.forEach((p) => {
    const { cluster } = assessProjectScientifically(p);
    map.get(cluster)?.push(p);
  });

  return order
    .map((cluster) => ({ cluster, items: map.get(cluster) ?? [] }))
    .filter((group) => group.items.length > 0);
}

/**
 * Pure function to compute language distribution sorted by count descending.
 */
export function computeLanguageBreakdown(projects: OrgProject[]): LanguageStat[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    const lang = project.language || 'Other';
    counts.set(lang, (counts.get(lang) ?? 0) + 1);
  }
  const entries = [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  const maxCount = entries[0]?.[1] ?? 1;
  return entries.map(([language, count]) => ({
    language,
    count,
    percentage: Math.round((count / maxCount) * 100),
  }));
}

/**
 * Pure function to compute sorted topic counts across all projects.
 */
export function computeTopicCounts(projects: OrgProject[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const topic of project.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
}

/**
 * Pure deterministic layout function for the 3D Orbital Constellation Lab.
 * Assigns each of the repositories to one of 3 concentric orbital rings:
 * - Ring 0 (Inner Flagship Ring): Top 5 starred projects
 * - Ring 1 (Middle Core Ring): Next 7 projects
 * - Ring 2 (Outer Frontier Ring): Remaining projects
 */
export function computeOrbitalPositions(
  projects: OrgProject[],
  explodeFactor = 0,
): OrbitalNodePosition[] {
  const clampedExplode = Math.max(0, Math.min(1, explodeFactor));
  const baseRadii: [number, number, number] = [3.6, 5.8, 8.2];
  const spreadMultiplier = 1 + clampedExplode * 0.45;

  const ring0 = projects.slice(0, 5);
  const ring1 = projects.slice(5, 12);
  const ring2 = projects.slice(12);

  const rings: { items: OrgProject[]; ringIndex: 0 | 1 | 2; baseRadius: number }[] = [
    { items: ring0, ringIndex: 0, baseRadius: baseRadii[0] * spreadMultiplier },
    { items: ring1, ringIndex: 1, baseRadius: baseRadii[1] * spreadMultiplier },
    { items: ring2, ringIndex: 2, baseRadius: baseRadii[2] * spreadMultiplier },
  ];

  const result: OrbitalNodePosition[] = [];

  for (const ring of rings) {
    const count = Math.max(1, ring.items.length);
    ring.items.forEach((proj, idx) => {
      const phaseOffset = ring.ringIndex * 0.42;
      const angleRad = (idx / count) * Math.PI * 2 + phaseOffset;
      const radius = ring.baseRadius;
      const x = Number((Math.cos(angleRad) * radius).toFixed(4));
      const z = Number((Math.sin(angleRad) * radius).toFixed(4));
      const yOffset = Number(
        (
          Math.sin(idx * 1.7 + ring.ringIndex) * 0.22 +
          clampedExplode * (ring.ringIndex - 1) * 0.85
        ).toFixed(4),
      );
      const nodeScale = Number((1 + Math.min(proj.stars, 4) * 0.12).toFixed(2));

      result.push({
        slug: proj.slug,
        ringIndex: ring.ringIndex,
        angleRad,
        radius,
        x,
        yOffset,
        z,
        nodeScale,
      });
    });
  }

  return result;
}
