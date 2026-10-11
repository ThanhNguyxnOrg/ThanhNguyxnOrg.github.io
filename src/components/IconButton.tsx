import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required: icon-only controls must have an accessible name. */
  label: string;
  icon: ReactNode;
  variant?: 'secondary' | 'ghost';
  size?: 'sm' | 'md';
};

/** Square icon-only button. 44px touch target at `md`. */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'ghost', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-md transition-ui focus-ring disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-5',
        size === 'md' ? 'size-11' : 'size-9',
        variant === 'secondary'
          ? 'border border-border-strong bg-surface text-fg hover:border-secondary hover:text-secondary'
          : 'text-fg-muted hover:bg-surface-raised hover:text-fg',
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
});

export default IconButton;
