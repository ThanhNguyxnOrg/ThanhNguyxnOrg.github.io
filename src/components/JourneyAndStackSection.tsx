import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Compass, ExternalLink, Eye, GitBranch, Layers } from 'lucide-react';
import {
  MIGRATION_DOC,
  ORG_PRINCIPLES,
  STACK_DOC,
  TIMELINE_STOPS,
  type OrgProject,
} from '../data/orgData';
import { assessProjectScientifically, computeLanguageBreakdown } from '../utils/projectLogic';
import { InteractiveCard3D, ProjectArtwork } from './InteractiveCard3D';
import {
  DotMatrixBackdrop,
  PrincipleDiagram,
  SectionSeam,
  SpotlightSurface,
} from './ArchitecturalDecor';

interface JourneyAndStackSectionProps {
  projects: OrgProject[];
  onInspectDossier: (project: OrgProject) => void;
  onFocusIn3D: (project: OrgProject) => void;
  onSelectLanguageFilter: (language: string) => void;
  mode?: 'all' | 'journey' | 'stack';
}

export default function JourneyAndStackSection({
  projects,
  onInspectDossier,
  onFocusIn3D,
  onSelectLanguageFilter,
  mode = 'all',
}: JourneyAndStackSectionProps) {
  const [activeStopIndex, setActiveStopIndex] = useState<number>(TIMELINE_STOPS.length - 1);
  const [activeRepoSubIndex, setActiveRepoSubIndex] = useState<number>(0);
  const [activeDocTab, setActiveDocTab] = useState<'stack' | 'migration'>('stack');

  const activeStop = TIMELINE_STOPS[activeStopIndex] ?? TIMELINE_STOPS[0];
  const matchedProjects = activeStop.tags
    .map((tag) => projects.find((p) => p.name.toLowerCase() === tag.toLowerCase()))
    .filter((p): p is OrgProject => Boolean(p));
  const spotlightProject =
    matchedProjects[activeRepoSubIndex] ?? matchedProjects[0] ?? projects[0];
  const spotlightScience = assessProjectScientifically(spotlightProject);

  const languageStats = computeLanguageBreakdown(projects);
  const principleMetrics = [
    `${projects.length} public repositories`,
    `${languageStats.length} programming languages`,
    `${projects.filter((project) => Boolean(project.demoUrl)).length} live Pages demos`,
    ORG_PRINCIPLES[3]?.metric ?? '',
  ];

  const handleSelectMilestone = (idx: number) => {
    setActiveStopIndex(idx);
    setActiveRepoSubIndex(0);
  };

  const showJourney = mode === 'all' || mode === 'journey';
  const showStack = mode === 'all' || mode === 'stack';

  return (
    <>
      {showJourney && (
        <>
          <SectionSeam label="02 · PRINCIPLES" />

          {/* SECTION 2: Principles of the Practice (Seamless Architectural Hairline Border-Grid) */}
          <section
            id="principles"
            aria-labelledby="principles-heading"
            className="relative scroll-mt-24 overflow-hidden bg-[#090D16] py-20 md:py-24"
          >
            <DotMatrixBackdrop align="left" tint="cyan" />

            <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <p className="font-mono text-xs text-[#FCD34D]">02. Operating Principles</p>
                  <h2
                    id="principles-heading"
                    className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
                  >
                    How the practice works.
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                    ThanhNguyxnOrg is not tied to a single framework or product vertical. Every tool
                    in the organization follows four foundational engineering standards.
                  </p>
                </div>
                <span className="font-mono text-xs text-[#868CA6] tabular-nums">
                  4 core standards · Open source by default
                </span>
              </div>

              {/* Unified Vercel/Linear 4-Column Hairline Architectural Grid */}
              <ol className="mt-12 grid overflow-hidden rounded-2xl border border-[#1E263B] bg-[#0B0F1A] sm:grid-cols-2 lg:grid-cols-4">
                {ORG_PRINCIPLES.map((item, idx) => (
                  <motion.li
                    key={item.index}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.42, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group/cell border-b border-[#1E263B] sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
                  >
                    <SpotlightSurface className="cell-top-beam flex h-full flex-col justify-between p-6 transition-colors duration-200 hover:bg-[#0F1524] sm:p-7">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#868CA6]">
                        <span className="text-[#F59E0B]">{item.index}</span>
                        <span className="truncate tabular-nums">
                          {principleMetrics[idx] ?? item.metric}
                        </span>
                      </div>

                      {/* Framed animated vector engineering illustration */}
                      <div className="mt-5 mb-5">
                        <PrincipleDiagram index={idx} />
                      </div>

                      <h3 className="font-display text-2xl font-bold text-[#F4F5FA]">
                        {item.verb}
                      </h3>
                      <p className="mt-1 font-display text-sm font-semibold text-[#FCD34D]">
                        {item.line}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[#A3A9BF]">{item.body}</p>
                    </div>
                    </SpotlightSurface>
                  </motion.li>
                ))}
              </ol>
            </div>
          </section>

          <SectionSeam glow label="03 · TIMELINE" />

          {/* SECTION 3: Second Lives Interactive Journey Timeline */}
          <section
            id="journey"
            aria-labelledby="journey-heading"
            className="relative scroll-mt-24 overflow-hidden py-20 md:py-28"
          >
            <DotMatrixBackdrop align="right" tint="amber" />

            <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <p className="font-mono text-xs text-[#FCD34D]">03. Chronological Evolution</p>
                  <h2
                    id="journey-heading"
                    className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
                  >
                    Second lives &amp; milestones.
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                    Where each repository started, and what it evolved into. Select any milestone
                    below to inspect the repositories built or rebuilt during that chapter.
                  </p>
                </div>

                {/* Quiet editorial chapter readout */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-[#868CA6] md:justify-end">
                  <span className="text-[#FCD34D] tabular-nums">
                    Chapter {activeStopIndex + 1} / {TIMELINE_STOPS.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#C9CDE0] tabular-nums">{activeStop.date}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#38BDF8]">{activeStop.title}</span>
                </div>
              </div>

              <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-stretch">
                {/* Left Column: Connected Architectural Vertical Timeline Spine */}
                <div className="relative min-w-0 pl-7 sm:pl-9 lg:col-span-7">
                  {/* Continuous hairline vertical rail + animated amber-to-cyan progress beam */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-4 bottom-4 left-[9px] w-px bg-[#1E263B] sm:left-[11px]"
                  >
                    <motion.div
                      className="w-full origin-top bg-gradient-to-b from-[#F59E0B] via-[#FCD34D] to-[#38BDF8]"
                      animate={{
                        height: `${((activeStopIndex + 1) / Math.max(1, TIMELINE_STOPS.length)) * 100}%`,
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>

                  <div
                    className="flex h-full flex-col justify-between gap-3"
                    role="tablist"
                    aria-label="Organization timeline milestones"
                  >
                    {TIMELINE_STOPS.map((stop, idx) => {
                      const isSelected = idx === activeStopIndex;
                      const isPassed = idx <= activeStopIndex;
                      return (
                        <button
                          key={stop.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          onClick={() => handleSelectMilestone(idx)}
                          className={`group relative flex w-full flex-col gap-2 rounded-2xl border p-5 text-left transition-all duration-200 sm:p-6 ${
                            isSelected
                              ? 'surface-hairline cell-top-beam border-[#F59E0B]/70 shadow-[0_14px_38px_-16px_rgba(245,158,11,0.22)]'
                              : 'border-[#1E263B] bg-[#0B0F1A]/85 hover:border-[#2D3854] hover:bg-[#0E1422]'
                          }`}
                        >
                          {/* Precision rail node marker + horizontal bridge aligned to vertical spine */}
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute top-[32px] -left-[12px] h-px w-[12px] transition-colors duration-200 sm:-left-[18px] sm:w-[18px] ${
                              isSelected
                                ? 'bg-[#F59E0B]/80'
                                : isPassed
                                  ? 'bg-[#F59E0B]/35'
                                  : 'bg-[#1E263B] group-hover:bg-[#2D3854]'
                            }`}
                          />
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute top-7 -left-[23px] flex size-[11px] items-center justify-center rounded-full border transition-all duration-200 sm:-left-[29px] ${
                              isSelected
                                ? 'border-[#FCD34D] bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.75)]'
                                : isPassed
                                  ? 'border-[#F59E0B]/60 bg-[#0D111C]'
                                  : 'border-[#2D3854] bg-[#07090F] group-hover:border-[#475577]'
                            }`}
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                            <span
                              className={
                                isSelected ? 'font-semibold text-[#FCD34D]' : 'text-[#868CA6]'
                              }
                            >
                              {stop.date} · Milestone 0{idx + 1}
                            </span>
                            <span className="text-[#868CA6]">{stop.tags.join(' · ')}</span>
                          </div>
                          <h3 className="font-display text-xl font-bold text-[#F4F5FA]">
                            {stop.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[#A3A9BF]">
                            {stop.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

            {/* Right Column: Dynamic Chapter Spotlight Stage (preserves authentic repo theme artwork) */}
            <div className="flex min-w-0 flex-col lg:col-span-5">
              <InteractiveCard3D className="h-full" maxTilt={3.5}>
                <div className="surface-hairline flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#2D3854]">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E263B] px-5 py-3.5 font-mono text-xs">
                      <span className="text-[#FCD34D]">
                        Chapter {activeStopIndex + 1} of {TIMELINE_STOPS.length} ·{' '}
                        {activeStop.date}
                      </span>
                      <span className="text-[#A3A9BF] tabular-nums">
                        {spotlightProject.pushedAt.slice(0, 10)}
                      </span>
                    </div>

                    {matchedProjects.length > 1 && (
                      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#1E263B] bg-[#090D16] px-5 py-2.5">
                        <span className="mr-1 font-mono text-[11px] text-[#868CA6]">
                          Chapter Repos:
                        </span>
                        {matchedProjects.map((proj, rIdx) => {
                          const active = rIdx === activeRepoSubIndex;
                          return (
                            <button
                              key={proj.slug}
                              type="button"
                              onClick={() => setActiveRepoSubIndex(rIdx)}
                              className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                                active
                                  ? 'bg-[#F59E0B] font-semibold text-[#07090F]'
                                  : 'bg-[#141A29] text-[#C9CDE0] hover:text-[#F4F5FA]'
                              }`}
                            >
                              {proj.name}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeStop.id}-${spotlightProject.slug}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="aspect-[2/1] w-full border-b border-[#1E263B]">
                          <ProjectArtwork
                            title={spotlightProject.name}
                            image={spotlightProject.image}
                            logo={spotlightProject.logo}
                            logoBare={spotlightProject.logoBare}
                            pattern={spotlightProject.pattern}
                            accent={spotlightProject.accent}
                            className="h-full w-full"
                          />
                        </div>

                        <div className="flex flex-col gap-4 p-6">
                          <div>
                            <p className="font-mono text-xs text-[#868CA6]">
                              {spotlightProject.category} · {spotlightProject.language} ·{' '}
                              {spotlightProject.stars}{' '}
                              {spotlightProject.stars === 1 ? 'star' : 'stars'} ·{' '}
                              {spotlightProject.forks} forks
                            </p>
                            <div className="mt-1.5 flex min-w-0 items-center gap-2.5">
                              {spotlightProject.logo && (
                                <img
                                  src={spotlightProject.logo}
                                  alt=""
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                  className="size-6 shrink-0 rounded-md border border-[#2D3854] bg-[#07090F] p-0.5 object-contain"
                                />
                              )}
                              <h4 className="truncate font-display text-2xl font-bold text-[#F4F5FA]">
                                {spotlightProject.name}
                              </h4>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-[#C9CDE0]">
                              {spotlightProject.story ?? spotlightProject.blurb}
                            </p>
                          </div>

                          {/* Hairline-separated 4-Dimension Telemetry (no nested box) */}
                          <div className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-[#1E263B] pt-4">
                            {(
                              [
                                {
                                  label: 'Traction',
                                  val: spotlightScience.dimensions.traction,
                                },
                                {
                                  label: 'Readiness',
                                  val: spotlightScience.dimensions.readiness,
                                },
                                {
                                  label: 'Architecture',
                                  val: spotlightScience.dimensions.architecture,
                                },
                                {
                                  label: 'Velocity',
                                  val: spotlightScience.dimensions.velocity,
                                },
                              ] as const
                            ).map((dim) => (
                              <div key={dim.label} className="flex flex-col gap-1">
                                <div className="flex items-center justify-between font-mono text-[11px]">
                                  <span className="text-[#868CA6]">{dim.label}</span>
                                  <span className="text-[#F4F5FA] tabular-nums">{dim.val}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#141A29]">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#38BDF8]"
                                    style={{ width: `${dim.val}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#1E263B] px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onInspectDossier(spotlightProject)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#F59E0B] px-3.5 py-2 text-xs font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] whitespace-nowrap shrink-0"
                      >
                        <Eye className="size-3.5" aria-hidden="true" />
                        Inspect {spotlightProject.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => onFocusIn3D(spotlightProject)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#2D3854] bg-[#141A29] px-3 py-2 text-xs font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                      >
                        <Compass className="size-3.5 text-[#FCD34D]" aria-hidden="true" />
                        3D Node
                      </button>
                    </div>

                    <a
                      href={spotlightProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-[#C9CDE0] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
                    >
                      GitHub
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </InteractiveCard3D>
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {showStack && (
      <section
        id="stack"
        aria-labelledby="stack-heading"
        className="scroll-mt-24 border-b border-[#1E263B]/80 bg-[#0A0E18] py-16 md:py-20"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-[#FCD34D]">
                {mode === 'stack' ? 'Live Architecture & Migration' : '04. Live Architecture & Migration'}
              </p>
              <h2
                id="stack-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
              >
                The stack, live in production.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                Language distribution is calculated directly from the {projects.length} synced
                repositories. Select any language bar to open the Repository Archive filtered by
                that stack.
              </p>
            </div>

            {/* Primer Segmented Control */}
            <div className="flex max-w-full flex-wrap items-center gap-1 self-start rounded-xl border border-[#1E263B] bg-[#07090F] p-1">
              <button
                type="button"
                onClick={() => setActiveDocTab('stack')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeDocTab === 'stack'
                    ? 'bg-[#F59E0B] font-semibold text-[#07090F]'
                    : 'text-[#A3A9BF] hover:text-[#F4F5FA]'
                }`}
              >
                <Layers className="size-3.5" aria-hidden="true" />
                Live Tech Stack
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('migration')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeDocTab === 'migration'
                    ? 'bg-[#F59E0B] font-semibold text-[#07090F]'
                    : 'text-[#A3A9BF] hover:text-[#F4F5FA]'
                }`}
              >
                <GitBranch className="size-3.5" aria-hidden="true" />
                Migration &amp; Legacy Note
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            {/* Left 6 Cols: Interactive Language Breakdown */}
            <div className="surface-hairline flex min-w-0 flex-col justify-between rounded-2xl border border-[#1E263B] p-6 sm:p-8 lg:col-span-6">
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#868CA6]">
                  <span>Language Distribution</span>
                  <span className="tabular-nums">{projects.length} repositories</span>
                </div>
                <ul
                  className="mt-6 flex flex-col gap-3"
                  aria-label="Languages by repository count"
                >
                  {languageStats.map((stat) => (
                    <li key={stat.language}>
                      <button
                        type="button"
                        onClick={() => onSelectLanguageFilter(stat.language)}
                        className="group flex w-full flex-col gap-1.5 rounded-lg p-1.5 text-left transition-colors hover:bg-[#141A29]"
                      >
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="font-medium text-[#F4F5FA] group-hover:text-[#FCD34D]">
                            {stat.language}
                          </span>
                          <span className="text-[#A3A9BF] tabular-nums">
                            {stat.count} {stat.count === 1 ? 'repo' : 'repos'}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#141A29]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stat.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#38BDF8]"
                          />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-[#1E263B] pt-4 font-mono text-xs text-[#868CA6]">
                Click any language row to open the Repository Archive filtered by that stack.
              </div>
            </div>

            {/* Right 6 Cols: Hairline-Structured Monograph Panel (no nested boxes) */}
            <div className="surface-hairline flex min-w-0 flex-col justify-between rounded-2xl border border-[#1E263B] p-6 sm:p-8 lg:col-span-6">
              <AnimatePresence mode="wait">
                {activeDocTab === 'stack' ? (
                  <motion.div
                    key="stack-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <span className="font-mono text-xs text-[#FCD34D]">{STACK_DOC.origin}</span>
                      <h3 className="mt-1 font-display text-2xl font-bold text-[#F4F5FA]">
                        {STACK_DOC.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#A3A9BF]">
                        {STACK_DOC.lead}
                      </p>
                    </div>

                    <div className="grid gap-6 border-t border-[#1E263B] pt-6 sm:grid-cols-2">
                      {STACK_DOC.layers.map((layer, i) => (
                        <div key={layer.name} className="flex flex-col gap-1.5">
                          <p className="font-mono text-xs font-medium text-[#F59E0B]">
                            0{i + 1}. {layer.name}
                          </p>
                          <p className="text-xs leading-relaxed text-[#C9CDE0]">{layer.detail}</p>
                        </div>
                      ))}
                    </div>

                    <blockquote className="border-t border-[#1E263B] pt-5 font-display text-sm font-semibold text-[#F4F5FA]">
                      “{STACK_DOC.mindset}”
                    </blockquote>
                  </motion.div>
                ) : (
                  <motion.div
                    key="migration-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <span className="font-mono text-xs text-[#FCD34D]">
                        {MIGRATION_DOC.origin}
                      </span>
                      <h3 className="mt-1 font-display text-2xl font-bold text-[#F4F5FA]">
                        {MIGRATION_DOC.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#A3A9BF]">
                        {MIGRATION_DOC.lead}
                      </p>
                    </div>

                    <div className="grid gap-6 border-t border-[#1E263B] pt-6 sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-xs font-medium text-[#F59E0B]">
                          01. Why Migration Matters
                        </p>
                        <ul className="mt-2.5 flex flex-col gap-1.5 text-xs text-[#C9CDE0]">
                          {MIGRATION_DOC.whyMatters.map((w) => (
                            <li key={w}>· {w}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-xs font-medium text-[#F59E0B]">
                          02. Forms of Rebuild
                        </p>
                        <ul className="mt-2.5 flex flex-col gap-1.5 text-xs text-[#C9CDE0]">
                          {MIGRATION_DOC.forms.map((f) => (
                            <li key={f}>· {f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <blockquote className="border-t border-[#1E263B] pt-5 font-display text-sm font-semibold text-[#F4F5FA]">
                      “{MIGRATION_DOC.closing}”
                    </blockquote>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#1E263B] pt-4">
                <span className="min-w-0 font-mono text-xs text-[#868CA6]">
                  Source: ThanhNguyxnOrg/.github
                </span>
                <a
                  href="https://github.com/ThanhNguyxnOrg/.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#FCD34D] hover:underline whitespace-nowrap"
                >
                  Read Org Docs
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
