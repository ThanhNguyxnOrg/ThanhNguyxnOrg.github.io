import clsx from 'clsx';
import { MetaLabel, Reveal, SectionHeader, Tag } from '../components';
import TiltCard from '../components/TiltCard';
import type { FullProject } from '../lib/projects';
import { ProjectActions, ProjectVisual } from '../site/ProjectBits';

function SyncStats({ p }: { p: FullProject }) {
  return (
    <dl className="grid grid-cols-3 gap-4 border-y border-border py-5">
      {[
        { value: String(p.stars), label: p.stars === 1 ? 'star' : 'stars' },
        { value: String(p.forks), label: p.forks === 1 ? 'fork' : 'forks' },
        { value: p.pushedAt.slice(0, 10), label: 'last push' },
      ].map((h) => (
        <div key={h.label} className="flex flex-col-reverse gap-1">
          <dt className="font-mono text-micro uppercase text-fg-subtle">{h.label}</dt>
          <dd className="font-display text-display-md font-semibold text-fg tabular whitespace-nowrap">{h.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function viewOf(p: FullProject) {
  return {
    title: p.name,
    summary: p.story ?? p.blurb,
    category: p.category,
    technologies: p.topics.slice(0, 6),
    glyph: { pattern: p.pattern, accent: p.accent } as const,
  };
}

function Tags({ technologies }: { technologies: string[] }) {
  if (!technologies.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
      {technologies.map((t) => <li key={t}><Tag>{t}</Tag></li>)}
    </ul>
  );
}

/** Poster: tall, title-dominant, media as a framed inset. */
function Poster({ p }: { p: FullProject }) {
  const v = viewOf(p);
  return (
    <article className="card-ticks relative flex h-full flex-col gap-6 overflow-hidden rounded-xl border border-border bg-surface p-6 md:p-8">
      <MetaLabel>{v.category}</MetaLabel>
      <h3 className="font-display text-display-lg font-bold text-fg">{v.title}</h3>
      <ProjectVisual title={v.title} glyph={v.glyph} image={p.image} className="aspect-[2/1] overflow-hidden rounded-lg border border-border" />
      <p className="text-body text-fg-muted">{v.summary}</p>
      <Tags technologies={v.technologies} />
      <div className="mt-auto"><ProjectActions repoUrl={p.repoUrl} demoUrl={p.demoUrl} size="sm" /></div>
    </article>
  );
}

/** Strip: stacked like Poster (2:1 boards need full width), kept distinct by column span. */
function Strip({ p }: { p: FullProject }) {
  const v = viewOf(p);
  return (
    <article className="flex h-full flex-col gap-5 overflow-hidden rounded-xl border border-border bg-surface p-6 md:p-8">
      <ProjectVisual title={v.title} glyph={v.glyph} image={p.image} className="aspect-[2/1] overflow-hidden rounded-lg border border-border" />
      <MetaLabel>{v.category}</MetaLabel>
      <h3 className="font-display text-display-lg font-bold text-fg">{v.title}</h3>
      <p className="text-body text-fg-muted">{v.summary}</p>
      <Tags technologies={v.technologies} />
      <div className="mt-auto pt-2"><ProjectActions repoUrl={p.repoUrl} demoUrl={p.demoUrl} size="sm" /></div>
    </article>
  );
}

export default function Featured({ projects }: { projects: FullProject[] }) {
  const [lead, ...rest] = projects.slice(0, 6);
  if (!lead) return null;
  return (
    <section id="projects" aria-labelledby="featured-title" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-page px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <SectionHeader
          title={<span id="featured-title">Things leaving the lab.</span>}
          description="A rotating selection of projects, ranked by stars. Every record below is verified data, no invented claims."
          className="lamp-cone"
        />
        <Reveal className="mt-14 flex flex-col gap-6" stagger="loose">
          <div data-reveal>
            <TiltCard max={7}>
            <article className="border-gold-hover card-ticks grid overflow-hidden rounded-xl border bg-surface lg:grid-cols-12">
              <ProjectVisual title={lead.name} glyph={{ pattern: lead.pattern, accent: lead.accent }} image={lead.image} className="aspect-[2/1] lg:col-span-7" />
              <div className="flex flex-col gap-6 p-6 md:p-10 lg:col-span-5">
                <MetaLabel>{lead.category}</MetaLabel>
                <h3 className="font-display text-display-xl font-bold text-fg">{lead.name}</h3>
                <p className="max-w-measure text-body-lg text-fg-soft">{lead.story ?? lead.blurb}</p>
                <SyncStats p={lead} />
                <div className="mt-auto pt-2"><ProjectActions repoUrl={lead.repoUrl} demoUrl={lead.demoUrl} /></div>
              </div>
            </article>
            </TiltCard>
          </div>
          {rest.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-12">
              {rest.map((p, i) => (
                <div data-reveal key={p.name} className={clsx('min-w-0', i % 2 === 0 ? 'lg:col-span-5' : 'lg:col-span-7')}>
                  {i % 2 === 0 ? <Poster p={p} /> : <Strip p={p} />}
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
