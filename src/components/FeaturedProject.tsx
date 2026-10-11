import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Button from './Button';
import { Badge, MetaLabel, StatusIndicator, Tag } from './Badge';
import { ProjectMedia, type Project } from './ProjectCard';
import { GitHubMark } from './BrandIcons';

/**
 * Editorial, asymmetric spotlight for one flagship project. Max one per page
 * section; never place in a grid with ProjectCards of the same size.
 */
export default function FeaturedProject({
  project,
  reverse = false,
  highlights,
}: {
  project: Project;
  reverse?: boolean;
  /** Up to 3 short proof points (metrics, capabilities). */
  highlights?: { value: string; label: string }[];
}) {
  return (
    <article className="relative grid overflow-hidden rounded-xl border border-border bg-surface lg:grid-cols-12">
      <div className={clsx('relative min-h-64 lg:col-span-7', reverse && 'lg:order-2')}>
        <ProjectMedia project={project} className="absolute inset-0 size-full" />
      </div>
      <div className="flex flex-col gap-6 p-6 md:p-10 lg:col-span-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="highlight">Featured</Badge>
          <Badge tone={project.categoryTone ?? 'primary'}>{project.category}</Badge>
        </div>
        <div className="flex flex-col gap-3">
          <MetaLabel>{project.year}</MetaLabel>
          <h3 className="font-display text-display-lg font-semibold text-fg">{project.title}</h3>
          <p className="max-w-measure text-body-lg text-fg-muted">{project.summary}</p>
        </div>
        {highlights && (
          <dl className="grid grid-cols-3 gap-4 border-y border-border py-5">
            {highlights.slice(0, 3).map((h) => (
              <div key={h.label} className="flex flex-col-reverse gap-1">
                <dt className="font-mono text-micro uppercase text-fg-subtle">{h.label}</dt>
                <dd className="font-display text-display-md font-semibold text-fg">{h.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((t) => (
            <li key={t}><Tag>{t}</Tag></li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-3">
          {project.href && (
            <Button href={project.href} iconEnd={<ArrowRight />}>View project</Button>
          )}
          {project.repoHref && (
            <Button href={project.repoHref} variant="ghost" iconStart={<GitHubMark className="size-4" />} target="_blank" rel="noopener noreferrer">
              Source
            </Button>
          )}
          {project.status && <StatusIndicator status={project.status} pulse className="ml-auto" />}
        </div>
      </div>
    </article>
  );
}
