import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import IconButton from './IconButton';

export type NavItem = { label: string; href: string };

/**
 * Site header. Desktop: inline links. Below `md`: a full-width disclosure
 * panel (button with aria-expanded + aria-controls, Escape to close, focus
 * returns to the toggle). Sticky with a translucent surface.
 */
export default function SiteNav({
  items,
  currentHref,
  action,
  homeHref = '/',
  sticky = true,
}: {
  items: NavItem[];
  currentHref?: string;
  action?: ReactNode;
  homeHref?: string;
  sticky?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={clsx('z-40 w-full border-b border-border bg-bg/80 backdrop-blur-md', sticky && 'sticky top-0')}>
      <nav aria-label="Primary" className="mx-auto flex h-16 w-full max-w-page items-center gap-6 px-5 md:px-8 lg:px-12">
        <a href={homeHref} className="rounded-sm focus-ring">
          <Logo />
        </a>
        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const current = item.href === currentHref;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={clsx(
                    'relative inline-flex h-10 items-center rounded-sm px-3 text-body-sm font-medium transition-ui focus-ring',
                    current ? 'text-fg' : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {item.label}
                  {current && <span aria-hidden className="absolute inset-x-3 -bottom-[0.6875rem] h-0.5 bg-primary" />}
                </a>
              </li>
            );
          })}
        </ul>
        {action && <div className="hidden md:block">{action}</div>}
        <IconButton
          ref={toggleRef}
          className="ml-auto md:hidden"
          label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={panelId}
          icon={open ? <X /> : <Menu />}
          onClick={() => setOpen((v) => !v)}
        />
      </nav>
      <div id={panelId} hidden={!open} className="border-t border-border bg-bg md:hidden">
        <ul className="flex flex-col px-5 py-4">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.href === currentHref ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 rounded-sm py-3 font-display text-display-md font-semibold text-fg-soft transition-ui hover:text-fg focus-ring aria-[current=page]:text-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        {action && <div className="border-t border-border px-5 py-4">{action}</div>}
      </div>
    </header>
  );
}
