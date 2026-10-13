import clsx from 'clsx';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import { Button, GitHubMark, ProjectGlyph, type GlyphAccent, type GlyphPattern } from '../components';

/**
 * Project visual. Real brand image when the entry declares one;
 * otherwise the generative glyph cover (no fake screenshots, no stock
 * imagery posing as UI). Labeled only where the label adds information.
 */
export function ProjectVisual({
  title,
  glyph,
  image = null,
  compact = false,
  className,
  label = true,
}: {
  title: string;
  glyph: { pattern: GlyphPattern; accent: GlyphAccent };
  image?: string | null;
  compact?: boolean;
  className?: string;
  label?: boolean;
}) {
  return (
    <div className={clsx('group project-card relative', image && !compact && 'image-frame', className)}>
      {image ? (
        <>
          <img
            src={image}
            alt=""
            loading="lazy"
            className={clsx(
              'absolute inset-0 size-full transition-transform duration-[600ms] motion-safe:group-hover:scale-[1.04]',
              compact ? 'bg-surface object-contain' : 'object-cover',
            )}
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />
          {!compact && (
            <span aria-hidden className="absolute bottom-3 right-3 rounded-xs bg-bg/80 px-2 py-1 font-mono text-micro uppercase text-fg-subtle backdrop-blur">
              1280×640
            </span>
          )}
        </>
      ) : (
        <ProjectGlyph pattern={glyph.pattern} accent={glyph.accent} className="absolute inset-0" />
      )}
      {label && (
        <span className="project-label absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-xs bg-bg/80 px-2 py-1 font-mono text-micro uppercase text-fg-subtle backdrop-blur">
          <ImageOff aria-hidden className="size-3" /> {title}
        </span>
      )}
    </div>
  );
}

/** Repo + demo actions. A missing demo renders nothing, never a dead button. */
export function ProjectActions({
  repoUrl,
  demoUrl,
  size = 'md',
}: {
  repoUrl: string;
  demoUrl: string | null;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size={size} href={repoUrl} target="_blank" rel="noopener noreferrer" iconStart={<GitHubMark className="size-4" />}>
        Repository
      </Button>
      {demoUrl && (
        <Button size={size} variant="secondary" href={demoUrl} target="_blank" rel="noopener noreferrer" iconEnd={<ArrowUpRight />}>
          Live demo
        </Button>
      )}
    </div>
  );
}
