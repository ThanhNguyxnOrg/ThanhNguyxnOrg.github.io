import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Compass, ExternalLink, Eye, Layers, Sparkles } from 'lucide-react';
import {
  MIGRATION_DOC,
  ORG_PRINCIPLES,
  STACK_DOC,
  TIMELINE_STOPS,
  type OrgProject,
} from '../data/orgData';
import { assessProjectScientifically, computeLanguageBreakdown } from '../utils/projectLogic';
import { InteractiveCard3D, ProjectArtwork } from './InteractiveCard3D';

interface JourneyAndStackSectionProps {
  projects: OrgProject[];
  onInspectDossier: (project: OrgProject) => void;
  onFocusIn3D: (project: OrgProject) => void;
  onSelectLanguageFilter: (language: string) => void;
}

export default function JourneyAndStackSection({
  projects,
  onInspectDossier,
  onFocusIn3D,
  onSelectLanguageFilter,
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
    `${projects.filter((project) => Boolean(project.demoUrl)).length} live GitHub Pages demos`,
    ORG_PRINCIPLES[3]?.metric ?? '',
  ];

  const handleSelectMilestone = (idx: number) => {
    setActiveStopIndex(idx);
    setActiveRepoSubIndex(0);
  };

  return (
    <>
      {/* SECTION 2: Principles of the Practice */}
      <section
        id="principles"
        aria-labelledby="principles-heading"
        className="scroll-mt-24 border-b border-[#1E263B]/80 bg-[#0A0E18] py-20 md:py-24"
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-[#FCD34D]">02. Operating Principles</p>
            <h2
              id="principles-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
            >
              How the practice works.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
              ThanhNguyxnOrg is not tied to a single framework or product vertical. Every tool in
              the organization follows four foundational rules.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ORG_PRINCIPLES.map((item, idx) => (
              <motion.li
                key={item.index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <InteractiveCard3D className="h-full" maxTilt={4}>
                  <div className="flex h-full flex-col justify-between rounded-3xl border border-[#1E263B] bg-gradient-to-b from-[#101625] to-[#0B0F1A] p-6 transition-colors hover:border-[#2D3854]">
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs text-[#868CA6]">
                        <span className="text-[#F59E0B]">{item.index}. Principle</span>
                        <span>{principleMetrics[idx] ?? item.metric}</span>
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-bold text-[#F4F5FA]">
                        {item.verb}
                      </h3>
                      <p className="mt-1 font-display text-sm font-semibold text-[#FCD34D]">
                        {item.line}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[#A3A9BF]">{item.body}</p>
                    </div>
                    <div className="mt-6 border-t border-[#1E263B] pt-3 font-mono text-[11px] text-[#868CA6]">
                      Verified in CI · MIT / Open Source
                    </div>
                  </div>
                </InteractiveCard3D>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 3: Second Lives Interactive Journey Timeline */}
      <section
        id="journey"
        aria-labelledby="journey-heading"
        className="scroll-mt-24 border-b border-[#1E263B]/80 py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-[#FCD34D]">03. Chronological Evolution</p>
            <h2
              id="journey-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
            >
              Second lives & milestones.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
              Where each repository came from, and what it evolved into. Select any milestone below
              to inspect the repositories born or rebuilt during that chapter.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-stretch">
            {/* Left Column: Interactive Timeline Selector */}
            <div
              className="flex flex-col justify-between gap-3.5 lg:col-span-7"
              role="tablist"
              aria-label="Organization timeline milestones"
            >
              {TIMELINE_STOPS.map((stop, idx) => {
                const isSelected = idx === activeStopIndex;
                return (
                  <button
                    key={stop.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectMilestone(idx)}
                    className={`group relative flex w-full flex-col gap-2 rounded-3xl border p-5 text-left transition-all duration-300 sm:p-6 ${
                      isSelected
                        ? 'border-[#F59E0B] bg-gradient-to-r from-[#161F33] to-[#0F1524] shadow-[0_12px_40px_-12px_rgba(245,158,11,0.25)]'
                        : 'border-[#1E263B] bg-[#0D111C] hover:border-[#2D3854]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span
                        className={isSelected ? 'font-semibold text-[#FCD34D]' : 'text-[#868CA6]'}
                      >
                        {stop.date} · Milestone 0{idx + 1}
                      </span>
                      <span className="text-[#868CA6]">{stop.tags.join(' · ')}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#F4F5FA]">{stop.title}</h3>
                    <p className="text-sm leading-relaxed text-[#A3A9BF]">{stop.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Animated Live Milestone Stage & Era Repository Switcher (Balanced Height) */}
            <div className="flex flex-col lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeStop.id}-${spotlightProject.slug}`}
                  initial={{ opacity: 0, y: 12, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.985 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <InteractiveCard3D className="h-full" maxTilt={4}>
                    <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#2D3854] bg-gradient-to-b from-[#111726] to-[#0B0F1A] shadow-2xl">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E263B] px-5 py-3.5 font-mono text-xs">
                          <span className="text-[#FCD34D]">
                            Chapter {activeStopIndex + 1} of {TIMELINE_STOPS.length} ·{' '}
                            {activeStop.date}
                          </span>
                          <span className="text-[#38BDF8] tabular-nums">
                            Index {spotlightScience.score}/99 · {spotlightScience.tier}
                          </span>
                        </div>

                        {/* Interactive Era Repository Switcher Tabs if Milestone has multiple repos */}
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
                                  className={`rounded-full px-3 py-1 font-mono text-xs transition-all whitespace-nowrap shrink-0 ${
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

                        <div className="aspect-[2/1] w-full border-b border-[#1E263B]">
                          <ProjectArtwork
                            title={spotlightProject.name}
                            image={spotlightProject.image}
                            logo={spotlightProject.logo}
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
                            <div className="mt-1 flex items-center gap-2.5 min-w-0">
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

                          {/* 4D Engineering Metrics inside Milestone Stage */}
                          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#1E263B] bg-[#07090F]/80 p-4">
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
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#1E263B] px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onInspectDossier(spotlightProject)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] whitespace-nowrap shrink-0"
                          >
                            <Eye className="size-3.5" aria-hidden="true" />
                            Inspect {spotlightProject.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => onFocusIn3D(spotlightProject)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#2D3854] bg-[#141A29] px-3.5 py-2 text-xs font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                          >
                            <Compass className="size-3.5 text-[#FCD34D]" aria-hidden="true" />
                            Focus in 3D
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Live Tech Stack & Migration Monograph */}
      <section
        id="stack"
        aria-labelledby="stack-heading"
        className="scroll-mt-24 border-b border-[#1E263B]/80 bg-[#0A0E18] py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-[#FCD34D]">04. Live Architecture & Migration</p>
              <h2
                id="stack-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
              >
                The stack, live in production.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                Language telemetry is computed directly from the {projects.length} repositories.
                Click any language bar to filter the scientific repository index below.
              </p>
            </div>

            {/* Interactive Segmented Control for Stack vs Migration */}
            <div className="flex items-center gap-1 self-start rounded-full border border-[#1E263B] bg-[#07090F] p-1">
              <button
                type="button"
                onClick={() => setActiveDocTab('stack')}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeDocTab === 'stack'
                    ? 'bg-[#F59E0B] font-semibold text-[#07090F] shadow-[0_0_16px_rgba(245,158,11,0.3)]'
                    : 'text-[#A3A9BF] hover:text-[#F4F5FA]'
                }`}
              >
                <Layers className="size-3.5" aria-hidden="true" />
                Live Tech Stack
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('migration')}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeDocTab === 'migration'
                    ? 'bg-[#F59E0B] font-semibold text-[#07090F] shadow-[0_0_16px_rgba(245,158,11,0.3)]'
                    : 'text-[#A3A9BF] hover:text-[#F4F5FA]'
                }`}
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                Migration & Legacy Note
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            {/* Left 6 Cols: Interactive Language Breakdown */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#1E263B] bg-gradient-to-b from-[#101625] to-[#0B0F1A] p-6 sm:p-8 lg:col-span-6">
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#868CA6]">
                  <span>LANGUAGE DISTRIBUTION</span>
                  <span className="tabular-nums">{projects.length} REPOSITORIES</span>
                </div>
                <ul
                  className="mt-6 flex flex-col gap-3.5"
                  aria-label="Languages by repository count"
                >
                  {languageStats.map((stat) => (
                    <li key={stat.language}>
                      <button
                        type="button"
                        onClick={() => onSelectLanguageFilter(stat.language)}
                        className="group flex w-full flex-col gap-1.5 rounded-xl p-1.5 text-left transition-colors hover:bg-[#141A29]"
                      >
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="font-medium text-[#F4F5FA] group-hover:text-[#FCD34D]">
                            {stat.language}
                          </span>
                          <span className="text-[#A3A9BF] tabular-nums">
                            {stat.count} {stat.count === 1 ? 'repo' : 'repos'}
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#141A29]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stat.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#38BDF8]"
                          />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-[#1E263B] pt-4 font-mono text-xs text-[#868CA6]">
                Click any language row to filter the full index below by that language.
              </div>
            </div>

            {/* Right 6 Cols: Animated Active Monograph Tab */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#1E263B] bg-gradient-to-b from-[#101625] to-[#0B0F1A] p-6 sm:p-8 lg:col-span-6">
              <AnimatePresence mode="wait">
                {activeDocTab === 'stack' ? (
                  <motion.div
                    key="stack-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      {STACK_DOC.layers.map((layer, i) => (
                        <div
                          key={layer.name}
                          className="rounded-2xl border border-[#1E263B] bg-[#07090F]/90 p-4"
                        >
                          <p className="font-mono text-xs text-[#F59E0B]">
                            0{i + 1}. {layer.name}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-[#C9CDE0]">
                            {layer.detail}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-[#2D3854] bg-[#141A29] p-4">
                      <p className="font-display text-sm font-semibold text-[#F4F5FA]">
                        “{STACK_DOC.mindset}”
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="migration-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[#1E263B] bg-[#07090F]/90 p-4">
                        <p className="font-mono text-xs text-[#F59E0B]">
                          01. Why Migration Matters
                        </p>
                        <ul className="mt-2.5 flex flex-col gap-1.5 text-xs text-[#C9CDE0]">
                          {MIGRATION_DOC.whyMatters.map((w) => (
                            <li key={w}>· {w}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-[#1E263B] bg-[#07090F]/90 p-4">
                        <p className="font-mono text-xs text-[#F59E0B]">02. Forms of Rebuild</p>
                        <ul className="mt-2.5 flex flex-col gap-1.5 text-xs text-[#C9CDE0]">
                          {MIGRATION_DOC.forms.map((f) => (
                            <li key={f}>· {f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#2D3854] bg-[#141A29] p-4">
                      <p className="font-display text-sm font-semibold text-[#F4F5FA]">
                        “{MIGRATION_DOC.closing}”
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between border-t border-[#1E263B] pt-4">
                <span className="font-mono text-xs text-[#868CA6]">
                  Source: ThanhNguyxnOrg/.github
                </span>
                <a
                  href="https://github.com/ThanhNguyxnOrg/.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#FCD34D] hover:underline whitespace-nowrap shrink-0"
                >
                  Read Org Docs
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
