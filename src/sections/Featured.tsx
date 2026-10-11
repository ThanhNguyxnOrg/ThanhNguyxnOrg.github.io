import clsx from 'clsx';
import { MetaLabel, Reveal, SectionHeader, Tag } from '../components';
import type { FullProject } from '../lib/projects';
import { ProjectActions, ProjectVisual } from '../site/ProjectBits';

const LEAD_HIGHLIGHTS: Record<string, { value: string; label: string }[]> = {
  blendops: [
    { value: '48', label: 'skills' },
    { value: '26', label: 'install targets' },
    { value: '189', label: 'commits' },
  ],
};

function viewOf(p: FullProject) {
  return {
    title: p.name,
    summary: p.story ?? p.blurb,
    category: p.category,
    technologies: p.topics.slice(0, 6),
    repoHref: p.repoUrl,
    href: p.demoUrl ?? undefined,
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
    <article className="relative flex h-full flex-col gap-6 overflow-hidden rounded-xl border border-border bg-surface p-6 md:p-8">
      <MetaLabel>{v.category}</MetaLabel>
      <h3 className="font-display text-display-lg font-bold text-fg">{v.title}</h3>
      <ProjectVisual title={v.title} glyph={v.glyph} className="aspect-[4/3] overflow-hidden rounded-lg border border-border" />
      <p className="text-body text-fg-muted">{v.summary}</p>
      <Tags technologies={v.technologies} />
      <div className="mt-auto"><ProjectActions repoUrl={p.repoUrl} demoUrl={p.demoUrl} size="sm" /></div>
    </article>
  );
}

/** Strip: wide, typographic, media as a narrow band on the right. */
function Strip({ p }: { p: FullProject }) {
  const v = viewOf(p);
  return (
    <article className="grid h-full overflow-hidden rounded-xl border border-border bg-surface md:grid-cols-5">
      <div className="flex flex-col gap-5 p-6 md:col-span-3 md:p-8">
        <MetaLabel>{v.category}</MetaLabel>
        <h3 className="font-display text-display-lg font-bold text-fg">{v.title}</h3>
        <p className="text-body text-fg-muted">{v.summary}</p>
        <Tags technologies={v.technologies} />
        <div className="mt-auto pt-2"><ProjectActions repoUrl={p.repoUrl} demoUrl={p.demoUrl} size="sm" /></div>
      </div>
      <ProjectVisual title={v.title} glyph={v.glyph} className="order-first min-h-48 md:order-none md:col-span-2" />
    </article>
  );
}

export default function Featured({ projects }: { projects: FullProject[] }) {
  const [lead, ...rest] = projects.slice(0, 6);
  if (!lead) return null;
  const highlights = LEAD_HIGHLIGHTS[lead.name];
  return (
    <section id="projects" aria-labelledby="featured-title" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-page px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <SectionHeader
          title={<span id="featured-title">Things leaving the lab.</span>}
          description="A rotating selection of projects, ranked by stars. Every record below is verified data, no invented claims."
        />
        <Reveal className="mt-14 flex flex-col gap-6" stagger="loose">
          <div data-reveal>
            <article className="grid overflow-hidden rounded-xl border border-border bg-surface lg:grid-cols-12">
              <ProjectVisual title={lead.name} glyph={{ pattern: lead.pattern, accent: lead.accent }} className="min-h-72 md:min-h-96 lg:col-span-7" />
              <div className="flex flex-col gap-6 p-6 md:p-10 lg:col-span-5">
                <MetaLabel>{lead.category}</MetaLabel>
                <h3 className="font-display text-display-xl font-bold text-fg">{lead.name}</h3>
                <p className="max-w-measure text-body-lg text-fg-soft">{lead.story ?? lead.blurb}</p>
                {highlights && (
                  <dl className="grid grid-cols-3 gap-4 border-y border-border py-5">
                    {highlights.map((h) => (
                      <div key={h.label} className="flex flex-col-reverse gap-1">
                        <dt className="font-mono text-micro uppercase text-fg-subtle">{h.label}</dt>
                        <dd className="font-display text-display-md font-semibold text-fg">{h.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <div className="mt-auto pt-2"><ProjectActions repoUrl={lead.repoUrl} demoUrl={lead.demoUrl} /></div>
              </div>
            </article>
          </div>
          {rest.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-12">
              {rest.map((p, i) => (
                <div data-reveal key={p.name} className={clsx(i % 2 === 0 ? 'lg:col-span-5' : 'lg:col-span-7')}>
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
