import type { ReactNode } from 'react';
import clsx from 'clsx';
import { MetaLabel, Tag } from './Badge';

/**
 * Section header. Editorial by default: oversized title, optional
 * description and action aligned to the baseline. No eyebrow kickers.
 */
export function SectionHeader({
  title,
  description,
  action,
  as: H = 'h2',
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <header className={clsx('grid gap-6 lg:grid-cols-12 lg:items-end', className)}>
      <div className="flex flex-col gap-4 lg:col-span-8">
        <H className="font-display text-display-xl font-semibold text-balance text-fg">{title}</H>
      </div>
      {(description || action) && (
        <div className="flex flex-col items-start gap-5 lg:col-span-4">
          {description && <p className="max-w-measure text-body-lg text-fg-muted">{description}</p>}
          {action}
        </div>
      )}
    </header>
  );
}

export type StatAccent = 'none' | 'primary' | 'secondary' | 'highlight';

const statAccent: Record<StatAccent, string> = {
  none: 'bg-border-strong',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  highlight: 'bg-highlight',
};

/** Metric display. Value is display type; label is mono; detail is optional context. */
export function Stat({ value, label, detail, accent = 'none', className }: { value: string; label: string; detail?: string; accent?: StatAccent; className?: string }) {
  return (
    <div className={clsx('relative flex flex-col gap-2 pl-5', className)}>
      <span aria-hidden className={clsx('absolute left-0 top-1 h-[calc(100%-0.5rem)] w-0.5', statAccent[accent])} />
      <dt className="order-2 font-mono text-label uppercase text-fg-muted">{label}</dt>
      <dd className="order-1 font-display text-display-lg font-semibold tabular-nums text-fg">{value}</dd>
      {detail && <dd className="order-3 text-body-sm text-fg-subtle">{detail}</dd>}
    </div>
  );
}

/** Wrap Stats so the dt/dd semantics are valid. */
export function StatGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <dl className={clsx('grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4', className)}>{children}</dl>;
}

export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={clsx('relative flex flex-col', className)}>{children}</ol>;
}

/** Timeline entry. `current` marks the latest milestone with the highlight node. */
export function TimelineItem({
  date,
  title,
  description,
  tags,
  current,
}: {
  date: string;
  title: string;
  description?: string;
  tags?: string[];
  current?: boolean;
}) {
  return (
    <li className="group/tl grid md:grid-cols-[9rem_1fr] md:gap-x-8">
      <time className="border-l border-border pb-2 pl-8 font-mono text-label uppercase text-fg-muted md:border-0 md:pb-0 md:pl-0 md:pt-1 md:text-right">
        {date}
      </time>
      <div className="relative flex flex-col gap-2 border-l border-border pb-12 pl-8 group-last/tl:border-transparent group-last/tl:pb-0">
        <span
          aria-hidden
          className={clsx(
            'absolute -left-[0.3125rem] top-2 size-2.5 rotate-45 border',
            current ? 'border-highlight bg-highlight' : 'border-fg-subtle bg-bg',
          )}
        />
        <p className="font-display text-title font-semibold text-fg">
          {title}
          {current && <span className="ml-2 align-middle font-mono text-micro uppercase text-highlight">Now</span>}
        </p>
        {description && <p className="max-w-reading text-body-sm text-fg-muted">{description}</p>}
        {tags && <div className="mt-1 flex flex-wrap gap-1.5">{tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}
      </div>
    </li>
  );
}

/** Closing call-to-action band. One per page. */
export function CTASection({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx('relative overflow-hidden rounded-xl border border-border bg-surface', className)}>
      <div aria-hidden className="absolute inset-0 bg-aurora" />
      <div aria-hidden className="absolute inset-0 bg-blueprint [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
      <div className="relative grid gap-8 p-8 md:p-14 lg:grid-cols-12 lg:items-end">
        <div className="flex flex-col gap-5 lg:col-span-8">
          <h2 className="font-display text-display-xl font-semibold text-balance text-fg">{title}</h2>
          {description && <p className="max-w-reading text-body-lg text-fg-muted">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">{actions}</div>
      </div>
    </section>
  );
}
