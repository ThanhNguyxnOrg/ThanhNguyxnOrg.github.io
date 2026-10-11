import { ArrowUpRight, Database } from 'lucide-react';
import { SectionHeader } from '../components';

export type EcoResource = {
  kind: 'Organization' | 'Package' | 'Resource';
  label: string;
  description: string;
  url: string | null;
};

export default function Ecosystem({ resources, fetchedAt }: { resources: EcoResource[]; fetchedAt: string }) {
  return (
    <section id="packages" aria-labelledby="eco-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-page gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:px-12">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeader
            className="lg:grid-cols-1"
            title={<span id="eco-title">Where the code lives.</span>}
            description="Repositories, packages and resources. Every number below was verified; destinations without proof stay unlinked."
          />
          <div className="flex gap-3 rounded-lg border border-dashed border-border-strong p-4">
            <Database aria-hidden className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
            <p className="text-body-sm text-fg-muted">
              <span className="font-mono text-label uppercase text-fg-soft">Snapshot {fetchedAt} · </span>
              Numbers refresh daily from the GitHub and npm APIs.
            </p>
          </div>
        </div>
        <ul className="flex flex-col border-t border-border lg:col-span-7">
          {resources.map((r, i) => {
            const body = (
              <>
                <span className="font-mono text-label text-fg-subtle">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex flex-col gap-1">
                  <span className="font-mono text-micro uppercase text-primary-text">{r.kind}</span>
                  <span className="font-display text-title font-semibold text-fg">{r.label}</span>
                  <span className="text-body-sm text-fg-muted">{r.description}</span>
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
