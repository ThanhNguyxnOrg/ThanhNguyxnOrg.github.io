import clsx from 'clsx';

export type FilterOption = { value: string; label: string; count?: number };

/**
 * Single-select filter as a group of toggle buttons (`aria-pressed`).
 * Scrolls horizontally on mobile instead of wrapping into a wall of chips.
 */
export default function FilterGroup({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={clsx('-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]', className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={clsx(
              'inline-flex h-9 shrink-0 items-center gap-2 rounded-pill border px-4 text-body-sm font-medium transition-ui focus-ring',
              active
                ? 'border-fg bg-fg text-bg'
                : 'border-border-strong text-fg-muted hover:border-fg-subtle hover:text-fg',
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={clsx('font-mono text-micro', active ? 'text-bg/70' : 'text-fg-subtle')}>{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select toggle chip (mono, for technology tags). Pair several inside a `role="group"`. */
export function ToggleChip({ pressed, onPressedChange, children }: { pressed: boolean; onPressedChange: (next: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={clsx(
        'inline-flex h-8 items-center gap-1.5 rounded-xs border px-2.5 font-mono text-label transition-ui focus-ring',
        pressed ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
      )}
    >
      <span aria-hidden>{pressed ? '−' : '+'}</span>
      {children}
    </button>
  );
}
