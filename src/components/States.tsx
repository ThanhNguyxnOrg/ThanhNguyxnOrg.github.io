import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CircleAlert, Inbox } from 'lucide-react';

/** Shown when a list/filter has no results. Always offer a way forward. */
export function EmptyState({
  title,
  description,
  icon = <Inbox />,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col items-center gap-4 rounded-lg border border-dashed border-border-strong px-6 py-16 text-center', className)}>
      <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-md bg-surface-raised text-fg-muted [&>svg]:size-6">
        {icon}
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-title font-semibold text-fg">{title}</p>
        {description && <p className="max-w-measure text-body-sm text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Recoverable error. Uses role="alert" so it is announced when it appears. */
export function ErrorState({ title, description, action, className }: { title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div role="alert" className={clsx('flex gap-4 rounded-lg border border-error/40 bg-error/10 p-5', className)}>
      <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-error" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-fg">{title}</p>
          {description && <p className="text-body-sm text-fg-soft">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

/** Loading placeholder. Shimmer is disabled under reduced motion. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx('animate-pulse rounded-md bg-surface-raised motion-reduce:animate-none', className)} />;
}

/** Skeleton matching ProjectCard geometry, to avoid layout shift. */
export function ProjectCardSkeleton() {
  return (
    <div role="status" aria-label="Loading project" className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-1.5"><Skeleton className="h-6 w-14" /><Skeleton className="h-6 w-16" /><Skeleton className="h-6 w-12" /></div>
      </div>
    </div>
  );
}
