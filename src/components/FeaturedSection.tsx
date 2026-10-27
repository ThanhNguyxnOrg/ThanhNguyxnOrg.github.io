import { motion } from 'motion/react';
import { ArrowUpRight, Compass, ExternalLink, Eye, GitFork, Star } from 'lucide-react';
import type { OrgProject } from '../data/orgData';
import { assessProjectScientifically } from '../utils/projectLogic';
import { InteractiveCard3D, ProjectArtwork } from './InteractiveCard3D';

interface FeaturedSectionProps {
  projects: OrgProject[];
  onInspectDossier: (project: OrgProject) => void;
  onFocusIn3D: (project: OrgProject) => void;
}

export default function FeaturedSection({
  projects,
  onInspectDossier,
  onFocusIn3D,
}: FeaturedSectionProps) {
  const [lead, ...rest] = projects.slice(0, 7);
  if (!lead) return null;
  const leadScience = assessProjectScientifically(lead);

  return (
    <section
      id="projects"
      aria-labelledby="featured-heading"
      className="scroll-mt-20 border-b border-[#1E263B]/80 py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-[#FCD34D]">
              01. Featured Engineering Releases · Tier I Flagships
            </p>
            <h2
              id="featured-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
            >
              Things leaving the lab.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
              Ranked by scientific impact index, verified GitHub traction, and active production
              deployments. Hover any card to experience spring-physics 3D depth or inspect its
              full architectural dossier.
            </p>
          </div>
          <a
            href="#archive"
            className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[#FCD34D] transition-colors hover:text-[#F59E0B] whitespace-nowrap shrink-0"
          >
            Jump to full {projects.length}-repository scientific index
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        {/* Lead Flagship Showcase Card (Split 2-Column with Spring 3D Tilt) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <InteractiveCard3D maxTilt={4.5}>
            <article className="grid overflow-hidden rounded-3xl border border-[#2D3854]/90 bg-gradient-to-br from-[#111726] via-[#0D111C] to-[#090C14] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] lg:grid-cols-12 lg:items-stretch">
              <div className="relative min-h-[260px] border-b border-[#1E263B] lg:col-span-7 lg:border-b-0 lg:border-r">
                <ProjectArtwork
                  title={lead.name}
                  image={lead.image}
                  logo={lead.logo}
                  logoBare={lead.logoBare}
                  pattern={lead.pattern}
                  accent={lead.accent}
                  className="h-full w-full"
                />
              </div>

              <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:col-span-5">
                <div className="flex flex-col gap-4">
                  {/* Unboxed Scientific Metadata Line */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#A3A9BF]">
                    <span className="text-[#FCD34D]">{lead.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{lead.language}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#38BDF8] tabular-nums">
                      Index {leadScience.score}/99
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">Updated {lead.pushedAt.slice(0, 10)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {lead.logo && (
                        <img
                          src={lead.logo}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="size-8 shrink-0 rounded-lg border border-[#2D3854] bg-[#07090F] p-1 object-contain"
                        />
                      )}
                      <h3 className="truncate font-display text-2xl font-bold tracking-tight text-[#F4F5FA] sm:text-3xl">
                        {lead.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs text-[#F4F5FA] tabular-nums shrink-0">
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                        {lead.stars}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="size-3.5 text-[#A3A9BF]" aria-hidden="true" />
                        {lead.forks}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-[#C9CDE0]">
                    {lead.story ?? lead.blurb}
                  </p>

                  <p className="font-mono text-xs leading-relaxed text-[#868CA6]">
                    {lead.topics.slice(0, 6).join(' · ')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t border-[#1E263B] pt-5">
                  <button
                    type="button"
                    onClick={() => onInspectDossier(lead)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-semibold text-[#07090F] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] whitespace-nowrap shrink-0"
                  >
                    <Eye className="size-3.5" aria-hidden="true" />
                    Inspect Dossier
                  </button>
                  <button
                    type="button"
                    onClick={() => onFocusIn3D(lead)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#2D3854] bg-[#141A29] px-4 py-2 text-xs font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                  >
                    <Compass className="size-3.5 text-[#FCD34D]" aria-hidden="true" />
                    View in 3D Astrolabe
                  </button>
                  <a
                    href={lead.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-[#C9CDE0] transition-colors hover:text-[#FCD34D] whitespace-nowrap shrink-0"
                  >
                    Repository
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          </InteractiveCard3D>
        </motion.div>

        {/* Asymmetric Bento Grid for Next 6 Featured Projects */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {rest.map((project, index) => {
            const spanClass =
              index === 0
                ? 'lg:col-span-7'
                : index === 1
                  ? 'lg:col-span-5'
                  : index === 2
                    ? 'lg:col-span-5'
                    : index === 3
                      ? 'lg:col-span-7'
                      : 'lg:col-span-6';
            const sci = assessProjectScientifically(project);

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.06, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={spanClass}
              >
                <InteractiveCard3D className="h-full" maxTilt={5}>
                  <article className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#1E263B] bg-gradient-to-b from-[#101625] to-[#0B0F1A] shadow-xl transition-colors hover:border-[#2D3854]">
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

                      <div className="flex flex-col gap-3 p-6">
                        {/* Unboxed Metadata */}
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#868CA6]">
                          <div>
                            <span className="text-[#FCD34D]">{project.category}</span>
                            <span aria-hidden="true"> · </span>
                            <span>{project.language}</span>
                            <span aria-hidden="true"> · </span>
                            <span className="text-[#38BDF8] tabular-nums">Index {sci.score}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-[#F4F5FA] tabular-nums">
                            <span className="inline-flex items-center gap-1">
                              <Star className="size-3 text-[#F59E0B]" aria-hidden="true" />
                              {project.stars}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-[#A3A9BF]">
                              <GitFork className="size-3" aria-hidden="true" />
                              {project.forks}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 min-w-0">
                          {project.logo && (
                            <img
                              src={project.logo}
                              alt=""
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                              className="size-6 shrink-0 rounded-md border border-[#2D3854] bg-[#07090F] p-0.5 object-contain"
                            />
                          )}
                          <h3 className="truncate font-display text-xl font-bold tracking-tight text-[#F4F5FA] sm:text-2xl">
                            {project.name}
                          </h3>
                        </div>

                        <p className="text-sm leading-relaxed text-[#A3A9BF]">
                          {project.story ?? project.blurb}
                        </p>

                        <p className="font-mono text-xs text-[#868CA6]">
                          {project.topics.slice(0, 5).join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-[#1E263B]/80 px-6 py-4">
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
                          className="inline-flex items-center gap-1 rounded-full border border-[#2D3854] px-2.5 py-1.5 font-mono text-xs text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
                        >
                          <Compass className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                          3D Node
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-[#FCD34D] transition-colors hover:underline whitespace-nowrap shrink-0"
                          >
                            Demo
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </a>
                        )}
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.name} GitHub repository`}
                          className="inline-flex items-center gap-1 font-mono text-xs text-[#868CA6] transition-colors hover:text-[#F4F5FA] whitespace-nowrap shrink-0"
                        >
                          GitHub
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </article>
                </InteractiveCard3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
