import type { ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { Badge, MetaLabel, StatusIndicator, Tag, type BadgeTone, type Status } from './Badge';
import ProjectGlyph, { type GlyphAccent, type GlyphPattern } from './ProjectGlyph';
import { GitHubMark } from './BrandIcons';

export type Project = {
  id: string;
  title: string;
  summary: string;
  category: string;
  categoryTone?: BadgeTone;
  status?: Status;
  technologies: string[];
  href?: string;
  repoHref?: string;
  /** Screenshot URL. Falls back to a generative glyph. */
  image?: string;
  glyph?: { pattern: GlyphPattern; accent: GlyphAccent };
  year?: string;
};

export function ProjectMedia({ project, className }: { project: Project; className?: string }) {
  if (project.image) {
    return <img src={project.image} alt="" loading="lazy" className={clsx('object-cover', className)} />;
  }
  return <ProjectGlyph pattern={project.glyph?.pattern} accent={project.glyph?.accent} className={className} />;
}

/**
 * Standard project card. The whole card is clickable through the title link
 * (stretched-link pattern) while the repo link stays independently focusable.
 */
export default function ProjectCard({ project, headingLevel = 3, footer }: { project: Project; headingLevel?: 2 | 3 | 4; footer?: ReactNode }) {
  const H = `h${headingLevel}` as const;
  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-ui hover:-translate-y-1 hover:border-border-strong hover:shadow-raised has-[a:focus-visible]:border-secondary">
      <div className="relative">
        <ProjectMedia project={project} className="aspect-[16/9] w-full transition-ui duration-500 group-hover/card:scale-[1.03]" />
        <div className="absolute left-4 top-4">
          <Badge tone={project.categoryTone ?? 'neutral'} className="bg-bg/70 backdrop-blur">{project.category}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <MetaLabel>{project.year}</MetaLabel>
          {project.status && <StatusIndicator status={project.status} />}
        </div>
        <H className="font-display text-title font-semibold text-fg">
          {project.href ? (
            <a href={project.href} className="rounded-xs outline-none after:absolute after:inset-0 after:content-['']">
              {project.title}
              <ArrowUpRight aria-hidden className="ml-1 inline size-4 text-fg-subtle transition-ui group-hover/card:text-secondary" />
            </a>
          ) : (
            project.title
          )}
        </H>
        <p className="line-clamp-3 text-body-sm text-fg-muted">{project.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((t) => (
            <li key={t}><Tag>{t}</Tag></li>
          ))}
        </ul>
        {(project.repoHref || footer) && (
          <div className="relative z-10 flex items-center justify-between border-t border-border pt-4">
            {project.repoHref && (
              <a
                href={project.repoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xs font-mono text-label text-fg-muted transition-ui hover:text-fg focus-ring"
              >
                <GitHubMark className="size-4" /> Source<span className="sr-only"> code for {project.title} (opens in a new tab)</span>
              </a>
            )}
            {footer}
          </div>
        )}
      </div>
    </article>
  );
}
