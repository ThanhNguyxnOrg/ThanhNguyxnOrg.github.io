import { useId, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

export type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> & {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  hint?: string;
  error?: string;
};

export default function SearchField({ label, value, onValueChange, hideLabel, hint, error, className, ...rest }: SearchFieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <label htmlFor={id} className={clsx('font-mono text-label uppercase text-fg-muted', hideLabel && 'sr-only')}>
        {label}
      </label>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={clsx(
            'h-11 w-full rounded-md border bg-surface pl-10 pr-10 text-body-sm text-fg placeholder:text-fg-subtle transition-ui outline-none [&::-webkit-search-cancel-button]:hidden',
            'focus-visible:border-secondary focus-visible:shadow-glow-secondary',
            'disabled:cursor-not-allowed disabled:opacity-40',
            error ? 'border-error' : 'border-border-strong hover:border-fg-subtle',
          )}
          {...rest}
        />
        {value && (
          <button
            type="button"
            onClick={() => onValueChange('')}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-sm text-fg-subtle transition-ui hover:bg-surface-raised hover:text-fg focus-ring"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} className="text-body-sm text-error-text">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-body-sm text-fg-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
