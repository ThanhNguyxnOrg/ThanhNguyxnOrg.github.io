import type { ReactNode } from 'react';
import clsx from 'clsx';

export type BadgeTone = 'neutral' | 'primary' | 'secondary' | 'highlight';

const tones: Record<BadgeTone, string> = {
  neutral: 'border-border-strong text-fg-soft',
  primary: 'border-primary/50 bg-primary/10 text-primary-text',
  secondary: 'border-secondary/40 bg-secondary/10 text-secondary',
  highlight: 'border-transparent bg-highlight text-on-highlight',
};

/** Category badge. Use `highlight` at most once per view (e.g. "New"). */
export function Badge({ tone = 'neutral', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex h-6 items-center gap-1.5 rounded-pill border px-2.5 font-mono text-micro font-medium uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Technology tag - lowercase mono, quiet. Never interactive by itself. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex h-6 items-center rounded-xs bg-surface-raised px-2 font-mono text-label normal-case tracking-normal text-fg-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Mono metadata label with an optional data prefix (date, count, code). */
export function MetaLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-2 font-mono text-label uppercase text-fg-muted', className)}>
      {index && (
        <>
          <span className="text-primary-text">{index}</span>
          <span aria-hidden className="text-fg-subtle">/</span>
        </>
      )}
      {children}
    </span>
  );
}

