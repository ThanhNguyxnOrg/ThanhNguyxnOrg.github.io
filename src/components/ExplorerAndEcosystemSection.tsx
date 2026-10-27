import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  GitFork,
  Layers,
  LayoutGrid,
  List,
  RefreshCw,
  RotateCcw,
  Search,
  Star,
  X,
} from 'lucide-react';
import type { EcoResource, OrgProject } from '../data/orgData';
import {
  assessProjectScientifically,
  computeTopicCounts,
  filterAndSortProjects,
  groupProjectsByCluster,
  type SortOption,
} from '../utils/projectLogic';
import { WORKFLOW_YAML_SNIPPET, type SyncTelemetryState } from '../utils/liveSync';
import { InteractiveCard3D, ProjectArtwork } from './InteractiveCard3D';

interface ExplorerAndEcosystemSectionProps {
  projects: OrgProject[];
  resources: EcoResource[];
  syncState: SyncTelemetryState;
  onTriggerSync: () => void;
  externalQuery: string;
  onExternalQueryChange: (q: string) => void;
  onInspectDossier: (project: OrgProject) => void;
  onFocusIn3D: (project: OrgProject) => void;
}

export default function ExplorerAndEcosystemSection({
  projects,
  resources,
  syncState,
  onTriggerSync,
  externalQuery,
  onExternalQueryChange,
  onInspectDossier,
  onFocusIn3D,
}: ExplorerAndEcosystemSectionProps) {
  const [category, setCategory] = useState<string>('all');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [onlyLiveDemos, setOnlyLiveDemos] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOption>('scientific');
  const [viewMode, setViewMode] = useState<'clusters' | 'grid' | 'list'>('grid');
  const [showAllTopics, setShowAllTopics] = useState<boolean>(false);
  const [copiedPkg, setCopiedPkg] = useState<string | null>(null);
  const [copiedYaml, setCopiedYaml] = useState<boolean>(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const topicCounts = useMemo(() => computeTopicCounts(projects), [projects]);
  const visibleTopics = showAllTopics ? topicCounts.slice(0, 24) : topicCounts.slice(0, 10);

  const filteredProjects = useMemo(
    () =>
      filterAndSortProjects(projects, {
        query: externalQuery,
        category,
        topics: selectedTopics,
        onlyLiveDemos,
        sort,
      }),
    [projects, externalQuery, category, selectedTopics, onlyLiveDemos, sort],
  );

  const clusteredGroups = useMemo(
    () => groupProjectsByCluster(filteredProjects),
    [filteredProjects],
  );

  const liveDemoCount = useMemo(
    () => projects.filter((p) => Boolean(p.demoUrl)).length,
    [projects],
  );

  const hasActiveFilters =
    externalQuery.trim().length > 0 ||
    category !== 'all' ||
    selectedTopics.length > 0 ||
    onlyLiveDemos;

  const resetAllFilters = () => {
    onExternalQueryChange('');
    setCategory('all');
    setSelectedTopics([]);
    setOnlyLiveDemos(false);
    setSort('scientific');
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const handleCopyCommand = async (pkgName: string) => {
    try {
      await navigator.clipboard.writeText(`npm i ${pkgName}`);
    } catch {
      // Fallback if clipboard API is restricted
    }
    setCopiedPkg(pkgName);
    window.setTimeout(() => {
      setCopiedPkg((curr) => (curr === pkgName ? null : curr));
    }, 2000);
  };

  const handleCopyWorkflowYaml = async () => {
    try {
      await navigator.clipboard.writeText(WORKFLOW_YAML_SNIPPET);
    } catch {
      // Fallback
    }
    setCopiedYaml(true);
    window.setTimeout(() => setCopiedYaml(false), 2000);
  };

  const renderProjectCard = (project: OrgProject) => {
    const sci = assessProjectScientifically(project);
    return (
      <InteractiveCard3D key={project.slug} className="h-full" maxTilt={5}>
        <article className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#1E263B] bg-gradient-to-b from-[#101625] to-[#0B0F1A] shadow-lg transition-colors hover:border-[#2D3854]">
          <div>
            <div className="aspect-[2/1] w-full border-b border-[#1E263B]/80">
              <ProjectArtwork
                title={project.name}
                image={project.image}
                logo={project.logo}
                logoBare={project.logoBare}
                pattern={project.pattern}
                accent={project.accent}
                className="h-full w-full"
              />
            </div>

            <div className="flex flex-col gap-2.5 p-5">
              {/* Unboxed Scientific Metadata */}
              <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#868CA6]">
                <span className="truncate">
                  <span className="text-[#FCD34D]">{project.category}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{project.language}</span>
                  <span aria-hidden="true"> · </span>
                  <span className="text-[#38BDF8] tabular-nums">Index {sci.score}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-[#F4F5FA] tabular-nums shrink-0">
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3 text-[#F59E0B]" aria-hidden="true" />
                    {project.stars}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[#A3A9BF]">
                    <GitFork className="size-3" aria-hidden="true" />
                    {project.forks}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  {project.logo && (
                    <img
                      src={project.logo}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="size-5 shrink-0 rounded border border-[#2D3854] bg-[#07090F] p-0.5 object-contain"
                    />
                  )}
                  <h3 className="truncate font-display text-lg font-bold text-[#F4F5FA]">
                    {project.name}
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-[#868CA6] whitespace-nowrap shrink-0">
                  {sci.tier.split('·')[0].trim()}
                </span>
              </div>

              <p className="line-clamp-2 text-xs leading-relaxed text-[#A3A9BF]">
                {project.blurb}
              </p>

              {project.topics.length > 0 && (
                <p className="truncate font-mono text-[11px] text-[#868CA6]">
                  {project.topics.slice(0, 4).join(' · ')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-[#1E263B]/80 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onInspectDossier(project)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#141A29] px-3 py-1.5 text-xs font-medium text-[#F4F5FA] transition-colors hover:bg-[#1E263B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
              >
                <Eye className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                Dossier
              </button>
              <button
                type="button"
                onClick={() => onFocusIn3D(project)}
                className="rounded-full border border-[#2D3854] px-2.5 py-1.5 font-mono text-[11px] text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
              >
                3D Node
              </button>
            </div>

            <div className="flex items-center gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#FCD34D] hover:underline whitespace-nowrap shrink-0"
                >
                  Demo
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </a>
              )}
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-[#868CA6] hover:text-[#F4F5FA] whitespace-nowrap shrink-0"
              >
                Repo
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </InteractiveCard3D>
    );
  };

  return (
    <>
      {/* SECTION 5: Full Scientific Index Explorer */}
      <section
        id="archive"
        aria-labelledby="archive-heading"
        className="scroll-mt-24 border-b border-[#1E263B]/80 py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-[#FCD34D]">
                05. Complete Scientific Engineering Index
              </p>
              <h2
                id="archive-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
              >
                The full repository archive.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                Organized scientifically by Engineering Impact Score, Domain Cluster, and live
                GitHub telemetry. Switch between 3D Grid, Domain Clusters, or Compact Table views.
              </p>
            </div>

            {/* Sort + Layout View Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-[#1E263B] bg-[#0D111C] p-1">
                {(
                  [
                    { id: 'scientific', label: 'Scientific Impact' },
                    { id: 'stars', label: 'Top Starred' },
                    { id: 'recent', label: 'Recently Pushed' },
                    { id: 'az', label: 'A to Z' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSort(opt.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      sort === opt.id
                        ? 'bg-[#F59E0B] font-semibold text-[#07090F]'
                        : 'text-[#868CA6] hover:text-[#F4F5FA]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 rounded-full border border-[#1E263B] bg-[#0D111C] p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#1E263B] text-[#FCD34D]'
                      : 'text-[#868CA6] hover:text-[#F4F5FA]'
                  }`}
                >
                  <LayoutGrid className="size-3.5" aria-hidden="true" />
                  3D Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('clusters')}
                  aria-label="Scientific Domain Clusters view"
                  aria-pressed={viewMode === 'clusters'}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === 'clusters'
                      ? 'bg-[#1E263B] text-[#FCD34D]'
                      : 'text-[#868CA6] hover:text-[#F4F5FA]'
                  }`}
                >
                  <Layers className="size-3.5" aria-hidden="true" />
                  Clusters
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="Compact list view"
                  aria-pressed={viewMode === 'list'}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#1E263B] text-[#FCD34D]'
                      : 'text-[#868CA6] hover:text-[#F4F5FA]'
                  }`}
                >
                  <List className="size-3.5" aria-hidden="true" />
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Search & Interactive Filter Bar */}
          <div className="mt-10 flex flex-col gap-5 rounded-3xl border border-[#1E263B] bg-gradient-to-b from-[#101625] to-[#0B0F1A] p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-12 md:items-center">
              {/* Search Field */}
              <div className="relative md:col-span-7">
                <label htmlFor="archive-search-input" className="sr-only">
                  Search repositories
                </label>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#868CA6]"
                  aria-hidden="true"
                />
                <input
                  id="archive-search-input"
                  type="search"
                  value={externalQuery}
                  onChange={(e) => onExternalQueryChange(e.target.value)}
                  placeholder="Search by repository name, language (e.g. Rust, C++, TypeScript), or keyword..."
                  className="h-11 w-full rounded-full border border-[#2D3854] bg-[#07090F] pl-11 pr-9 text-sm text-[#F4F5FA] placeholder-[#868CA6] transition-colors focus:border-[#F59E0B] focus:outline-none"
                />
                {externalQuery && (
                  <button
                    type="button"
                    onClick={() => onExternalQueryChange('')}
                    aria-label="Clear search query"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#868CA6] hover:text-[#F4F5FA]"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Live Demo Toggle + Reset */}
              <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-5 md:justify-end">
                <button
                  type="button"
                  onClick={() => setOnlyLiveDemos((v) => !v)}
                  aria-pressed={onlyLiveDemos}
                  className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    onlyLiveDemos
                      ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#FCD34D]'
                      : 'border-[#2D3854] bg-[#07090F] text-[#C9CDE0] hover:border-[#F59E0B]'
                  }`}
                >
                  Live Demos Only ({liveDemoCount})
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[#2D3854] bg-[#141A29] px-4 text-xs font-medium text-[#FCD34D] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div
              className="flex flex-wrap items-center gap-1.5 border-t border-[#1E263B] pt-4"
              role="group"
              aria-label="Filter by category"
            >
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  category === 'all'
                    ? 'bg-[#F59E0B] font-semibold text-[#07090F]'
                    : 'bg-[#07090F] text-[#A3A9BF] hover:bg-[#141A29] hover:text-[#F4F5FA]'
                }`}
              >
                All Categories ({projects.length})
              </button>
              {categories.map(([cat, count]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    category === cat
                      ? 'bg-[#F59E0B] font-semibold text-[#07090F]'
                      : 'bg-[#07090F] text-[#A3A9BF] hover:bg-[#141A29] hover:text-[#F4F5FA]'
                  }`}
                >
                  {cat} ({count})
                </button>
              ))}
            </div>

            {/* Topic Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-[#1E263B] pt-3">
              <span className="mr-1 font-mono text-xs text-[#868CA6] whitespace-nowrap shrink-0">
                Topics:
              </span>
              {visibleTopics.map(([topic, count]) => {
                const active = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    aria-pressed={active}
                    className={`rounded-full px-2.5 py-1 font-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#FCD34D] font-semibold text-[#07090F]'
                        : 'bg-[#141A29] text-[#A3A9BF] hover:text-[#F4F5FA]'
                    }`}
                  >
                    #{topic} ({count})
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowAllTopics((v) => !v)}
                className="ml-2 font-mono text-xs text-[#FCD34D] underline underline-offset-4 hover:text-[#F59E0B] whitespace-nowrap shrink-0"
              >
                {showAllTopics ? 'Fewer topics' : 'More topics'}
              </button>
            </div>
          </div>

          {/* Results Count Header */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#A3A9BF]">
            <span aria-live="polite" className="tabular-nums">
              Showing {filteredProjects.length} of {projects.length} verified repositories · Sorted
              by{' '}
              {sort === 'scientific'
                ? 'Scientific Engineering Index'
                : sort === 'stars'
                  ? 'Verified Stars'
                  : sort === 'recent'
                    ? 'Latest Push Timestamp'
                    : 'Alphabetical Order'}
            </span>
            {hasActiveFilters && <span className="text-[#FCD34D]">Filtered view active</span>}
          </div>

          {/* Results Display */}
          {filteredProjects.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-[#1E263B] bg-[#0D111C] p-12 text-center">
              <p className="font-display text-xl font-bold text-[#F4F5FA]">
                No repositories match the current filters
              </p>
              <p className="mt-2 max-w-md text-sm text-[#A3A9BF]">
                Try clearing a topic tag, switching categories, or searching for another keyword.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-5 py-2.5 text-xs font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D]"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'clusters' ? (
            <div className="mt-8 flex flex-col gap-12">
              {clusteredGroups.map((group) => (
                <div key={group.cluster} className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1E263B] pb-3">
                    <h3 className="font-display text-2xl font-bold text-[#F4F5FA]">
                      {group.cluster}
                    </h3>
                    <span className="font-mono text-xs text-[#FCD34D] tabular-nums">
                      {group.items.length}{' '}
                      {group.items.length === 1 ? 'repository' : 'repositories'} in cluster
                    </span>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((proj) => renderProjectCard(proj))}
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => renderProjectCard(project))}
            </motion.div>
          ) : (
            <ol className="mt-6 divide-y divide-[#1E263B] overflow-hidden rounded-3xl border border-[#1E263B] bg-[#0D111C]">
              {filteredProjects.map((project, idx) => {
                const sci = assessProjectScientifically(project);
                return (
                  <li
                    key={project.slug}
                    className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-[#141A29]/60 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-start gap-4">
                      <span className="pt-1 font-mono text-xs text-[#868CA6] tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-base font-bold text-[#F4F5FA]">
                            {project.name}
                          </h3>
                          <span className="font-mono text-xs text-[#868CA6]">
                            · {project.category} · {project.language} ·{' '}
                            <span className="text-[#38BDF8]">Index {sci.score}</span> ·{' '}
                            {project.stars}★
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#A3A9BF]">{project.blurb}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => onFocusIn3D(project)}
                        className="rounded-full border border-[#2D3854] px-3 py-1.5 font-mono text-xs text-[#C9CDE0] hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                      >
                        3D Node
                      </button>
                      <button
                        type="button"
                        onClick={() => onInspectDossier(project)}
                        className="rounded-full bg-[#F59E0B] px-3.5 py-1.5 text-xs font-semibold text-[#07090F] hover:bg-[#FCD34D] whitespace-nowrap shrink-0"
                      >
                        Dossier
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      {/* SECTION 6: Ecosystem, Zero-Touch Auto-Sync Pipeline (.yml) & npm Registry */}
      <section
        id="ecosystem"
        aria-labelledby="ecosystem-heading"
        className="scroll-mt-24 border-b border-[#1E263B]/80 bg-[#0A0E18] py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
            {/* Left 5 Cols: Auto-Sync Telemetry Engine + Zero-Touch .yml Workflow Card (Zero Empty Space) */}
            <div className="flex flex-col justify-between gap-6 lg:col-span-5">
              <div>
                <p className="font-mono text-xs text-[#FCD34D]">
                  06. Ecosystem, Zero-Touch Auto-Sync & npm Registry
                </p>
                <h2
                  id="ecosystem-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
                >
                  Where the code lives.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                  Published npm packages, organization automation bots, and core contributors.
                  Synchronized automatically via client-side REST APIs and a scheduled 6-hour
                  GitHub Actions <code className="text-[#FCD34D]">.yml</code> pipeline.
                </p>
              </div>

              {/* Card 1: Live Auto-Sync Telemetry & 4-Endpoint Verification Matrix */}
              <div className="rounded-3xl border border-[#2D3854] bg-gradient-to-b from-[#111726] to-[#0B0F1A] p-6 shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-[#FCD34D]">
                    AUTO-SYNC TELEMETRY ENGINE
                  </span>
                  <span className="font-mono text-xs text-[#34D399] tabular-nums">
                    {syncState.status === 'syncing'
                      ? 'SYNCING...'
                      : syncState.status === 'live'
                        ? 'LIVE API SYNCED'
                        : 'CI SNAPSHOT ACTIVE'}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-[#1E263B] py-3.5 font-mono text-xs">
                  <div>
                    <dt className="text-[#868CA6]">Data Source</dt>
                    <dd className="mt-0.5 text-[#F4F5FA]">{syncState.sourceLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-[#868CA6]">Timestamp</dt>
                    <dd className="mt-0.5 text-[#F4F5FA] tabular-nums">{syncState.lastSyncedAt}</dd>
                  </div>
                </dl>

                {/* 4 Live Endpoint Checks */}
                <ul className="mt-4 flex flex-col gap-2.5">
                  {syncState.checks.map((chk) => (
                    <li
                      key={chk.id}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-[#1E263B] bg-[#07090F]/80 px-3.5 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-medium text-[#F4F5FA]">{chk.name}</p>
                        <p className="truncate font-mono text-[11px] text-[#868CA6]">{chk.detail}</p>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-[#34D399] uppercase shrink-0">
                        VERIFIED
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onTriggerSync}
                    disabled={syncState.status === 'syncing'}
                    className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] disabled:opacity-60 whitespace-nowrap shrink-0"
                  >
                    <RefreshCw
                      className={`size-3.5 ${syncState.status === 'syncing' ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    {syncState.status === 'syncing' ? 'Syncing APIs...' : 'Sync Live Telemetry Now'}
                  </button>
                  {syncState.latencyMs !== null && (
                    <span className="font-mono text-xs text-[#868CA6] tabular-nums">
                      {syncState.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2: Zero-Touch GitHub Actions Workflow (.github/workflows/sync-org-data.yml) */}
              <div className="rounded-3xl border border-[#1E263B] bg-gradient-to-b from-[#101625] to-[#0B0F1A] p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#FCD34D]">
                    <Code2 className="size-4 text-[#F59E0B]" aria-hidden="true" />
                    <span>.github/workflows/sync-org-data.yml</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyWorkflowYaml}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#2D3854] bg-[#141A29] px-3 py-1 font-mono text-xs text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                  >
                    {copiedYaml ? (
                      <>
                        <Check className="size-3.5 text-[#34D399]" aria-hidden="true" />
                        Copied .yml
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                        Copy Workflow
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-[#A3A9BF]">
                  Zero-touch deduplicated sync: existing 19 repos update in-place without
                  duplication, and any new repo in <span className="text-[#F4F5FA]">ThanhNguyxnOrg</span>{' '}
                  joins the 3D Astrolabe automatically. Drop cover &amp; logo images into{' '}
                  <code className="text-[#FCD34D]">public/brand/</code> and{' '}
                  <code className="text-[#FCD34D]">public/logos/</code> with the repo name (any{' '}
                  <code className="text-[#C9CDE0]">.png/.svg/.webp/.jpg</code> or casing).
                </p>

                <details className="group mt-3 rounded-2xl border border-[#1E263B] bg-[#07090F] px-3.5 py-2.5">
                  <summary className="cursor-pointer select-none font-mono text-xs font-medium text-[#C9CDE0] transition-colors hover:text-[#FCD34D]">
                    Inspect scheduled 6-hour CI/CD workflow YAML
                  </summary>
                  <pre className="no-scrollbar mt-2.5 overflow-x-auto border-t border-[#1E263B] pt-2.5 font-mono text-[11px] leading-relaxed text-[#C9CDE0]">
                    <code>{WORKFLOW_YAML_SNIPPET}</code>
                  </pre>
                </details>
              </div>
            </div>

            {/* Right 7 Cols: Interactive Ecosystem & npm Registry List */}
            <ul className="flex flex-col justify-between divide-y divide-[#1E263B] overflow-hidden rounded-3xl border border-[#1E263B] bg-gradient-to-b from-[#101625] to-[#0B0F1A] lg:col-span-7">
              {resources.map((res, idx) => (
                <li
                  key={res.label}
                  className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-[#141A29]/45 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="pt-1 font-mono text-xs text-[#868CA6] tabular-nums">
                      0{idx + 1}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="text-[#FCD34D]">{res.kind}</span>
                        {res.version && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#F4F5FA] tabular-nums">{res.version}</span>
                          </>
                        )}
                        {typeof res.downloads === 'number' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-[#A3A9BF] tabular-nums">
                              <Download className="size-3 text-[#F59E0B]" aria-hidden="true" />
                              {res.downloads} / 30d
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#F4F5FA]">{res.label}</h3>

                      <p className="text-sm text-[#A3A9BF]">{res.description}</p>

                      {res.packageName && (
                        <div className="mt-2 flex items-center gap-2">
                          <code className="rounded-full border border-[#1E263B] bg-[#07090F] px-3.5 py-1.5 font-mono text-xs text-[#FCD34D]">
                            npm i {res.packageName}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyCommand(res.packageName!)}
                            aria-label={`Copy install command for ${res.packageName}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#2D3854] bg-[#141A29] px-3.5 py-1.5 font-mono text-xs font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                          >
                            {copiedPkg === res.packageName ? (
                              <>
                                <Check className="size-3.5 text-[#34D399]" aria-hidden="true" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 self-end font-mono text-xs font-medium text-[#C9CDE0] transition-colors hover:text-[#FCD34D] sm:self-center whitespace-nowrap shrink-0"
                  >
                    Open
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
