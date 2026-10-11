import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Lucide icon element placed before the label. */
  iconStart?: ReactNode;
  /** Lucide icon element placed after the label (use ArrowRight / ArrowUpRight). */
  iconEnd?: ReactNode;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

export type ButtonProps = Common &
  (
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  );

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-sans font-semibold transition-ui focus-ring disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 active:translate-y-px';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-fill text-on-primary hover:bg-primary-fill-hover hover:shadow-glow-primary',
  secondary:
    'border border-border-strong bg-surface text-fg hover:border-secondary hover:text-secondary',
  ghost: 'text-fg-soft hover:bg-surface-raised hover:text-fg',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-sm px-3 text-body-sm',
  md: 'h-11 rounded-md px-5 text-body-sm',
  lg: 'h-13 rounded-md px-7 text-body',
};

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return clsx(base, variants[variant], sizes[size], className);
}

/** Primary / secondary / ghost action. Renders `<a>` when `href` is set. */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', iconStart, iconEnd, loading, className, children, ...rest },
  ref,
) {
  const content = (
    <>
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : iconStart}
      <span>{children}</span>
      {iconEnd && (
        <span aria-hidden className="transition-ui group-hover/btn:translate-x-0.5 [&>svg]:size-4">
          {iconEnd}
        </span>
      )}
    </>
  );
  const cls = buttonClasses(variant, size, className);
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  const btn = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={btn.type ?? 'button'}
      className={cls}
      aria-busy={loading || undefined}
      {...btn}
      disabled={btn.disabled || loading}
    >
      {content}
    </button>
  );
});

export default Button;
