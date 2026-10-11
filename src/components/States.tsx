import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Inbox } from 'lucide-react';

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
