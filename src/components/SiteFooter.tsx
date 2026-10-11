import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Logo from './Logo';

export type FooterColumn = { title: string; links: { label: string; href: string; external?: boolean }[] };
export type SocialLink = { label: string; href: string; icon: ReactNode };

export default function SiteFooter({
  columns,
  socials,
  tagline,
  legal,
}: {
  columns: FooterColumn[];
  socials: SocialLink[];
  tagline: string;
  legal: string;
}) {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto grid w-full max-w-page gap-12 px-5 py-16 md:px-8 lg:grid-cols-12 lg:px-12">
        <div className="flex flex-col gap-5 lg:col-span-5">
          <Logo showDescriptor />
          <p className="max-w-measure text-body-sm text-fg-muted">{tagline}</p>
          <ul className="flex gap-2" aria-label="Social links">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                  className="inline-flex size-11 items-center justify-center rounded-md border border-border text-fg-muted transition-ui hover:border-border-strong hover:text-fg focus-ring [&>svg]:size-5"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <p className="font-mono text-label uppercase text-fg-subtle">{col.title}</p>
              <ul className="flex flex-col gap-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex min-h-9 items-center gap-1 rounded-xs text-body-sm text-fg-muted transition-ui hover:text-fg focus-ring"
                    >
                      {l.label}
                      {l.external && (
                        <>
                          <ArrowUpRight aria-hidden className="size-3.5" />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-page flex-col justify-between gap-2 px-5 py-6 font-mono text-micro uppercase text-fg-subtle sm:flex-row md:px-8 lg:px-12">
          <span>{legal}</span>
          <span>Built in the open</span>
        </div>
      </div>
    </footer>
  );
}
