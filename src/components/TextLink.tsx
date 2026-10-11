import type { AnchorHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';

export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  /** Opens in a new tab, adds the arrow glyph and a screen-reader hint. */
  external?: boolean;
  tone?: 'default' | 'muted';
};

/** Inline / standalone text link. Underline is always present (not color-only). */
export default function TextLink({ children, external, tone = 'default', className, ...rest }: TextLinkProps) {
  return (
    <a
      className={clsx(
        'group/link inline-flex items-baseline gap-0.5 rounded-xs underline decoration-1 underline-offset-4 transition-ui focus-ring',
        tone === 'default'
          ? 'text-secondary decoration-secondary/40 hover:decoration-secondary'
          : 'text-fg-muted decoration-border-strong hover:text-fg hover:decoration-fg',
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {external && (
        <>
          <ArrowUpRight
            aria-hidden
            className="size-3.5 self-center transition-ui group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          />
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
}
