import { ArrowUpRight, Database, Download } from 'lucide-react';
import { SectionHeader } from '../components';
import CopyButton from '../components/CopyButton';

export type EcoResource = {
  kind: 'Organization' | 'Package' | 'People' | 'Resource' | 'Bot';
  label: string;
  description: string;
  url: string | null;
  version?: string;
  downloads?: number;
  package?: string;
};

function avatarSlug(url: string | null): string | null {
  if (!url || !url.startsWith('https://github.com/')) return null;
  const slug = url.slice('https://github.com/'.length).split('/')[0];
  return slug || null;
}

export default function Ecosystem({ resources, fetchedAt }: { resources: EcoResource[]; fetchedAt: string }) {
  return (
    <section id="packages" aria-labelledby="eco-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-page gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:px-12">
        <hr className="divider-orn lg:col-span-12" data-glyph="+" />
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeader
            className="lg:grid-cols-1"
            title={<span id="eco-title">Where the code lives.</span>}
            description="Repositories, packages, people and resources. Every number below was verified; destinations without proof stay unlinked. Releases and repository automation run through the ThanhNguyxnAgent bot."
          />
          <div className="flex gap-3 rounded-lg border border-dashed border-border-strong p-4">
            <Database aria-hidden className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
            <p className="text-body-sm text-fg-muted">
              <span className="font-mono text-label uppercase text-fg-soft">Snapshot {fetchedAt}. </span>
              Numbers refresh daily from the GitHub and npm APIs.
            </p>
          </div>
        </div>
        <ul className="flex flex-col border-t border-border lg:col-span-7">
          {resources.map((r, i) => {
            const slug = avatarSlug(r.url);
            const showAvatar = (r.kind === 'People' || r.kind === 'Organization') && slug !== null;
            const body = (
              <>
                <span className="font-mono text-label text-fg-subtle">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex flex-col gap-1">
                  <span className="font-mono text-micro uppercase text-primary-text">{r.kind}</span>
                  <span className="flex flex-wrap items-center gap-2">
                    {showAvatar && (
                      <span className="relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-raised font-mono text-micro text-fg-muted" aria-hidden>
                        {slug.slice(0, 2).toUpperCase()}
                        <img
                          src={`https://github.com/${slug}.png?size=64`}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 size-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </span>
                    )}
                    <span className="font-display text-title font-semibold text-fg">{r.label}</span>
                    {r.version && (
                      <span className="rounded-pill border border-border-strong px-2 py-0.5 font-mono text-micro text-fg-muted tabular">{r.version}</span>
                    )}
                    {typeof r.downloads === 'number' && (
                      <span className="inline-flex items-center gap-1 rounded-pill border border-border-strong px-2 py-0.5 font-mono text-micro text-fg-muted tabular">
                        <Download aria-hidden className="size-3" /> {r.downloads}/30d
                      </span>
                    )}
                  </span>
                  <span className="text-body-sm text-fg-muted">{r.description}</span>
                  {r.package && (
                    <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-md border border-border bg-bg px-2 py-1">
                      <code className="font-mono text-body-sm text-fg">npm i {r.package}</code>
                      <CopyButton text={`npm i ${r.package}`} label={`Copy install command for ${r.package}`} />
                    </span>
                  )}
                </span>
                {r.url ? (
                  <ArrowUpRight aria-hidden className="size-5 text-fg-subtle transition-ui group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary" />
                ) : (
                  <span className="font-mono text-micro uppercase text-fg-subtle">Pending</span>
                )}
              </>
            );
            const cls = 'grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 border-b border-border py-5';
            return (
              <li key={r.label}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className={`group ${cls} rounded-xs transition-ui hover:bg-surface focus-ring`}>
                    {body}<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
