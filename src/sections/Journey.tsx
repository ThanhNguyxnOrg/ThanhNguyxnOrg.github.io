import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button, Reveal, SectionHeader, Timeline, TimelineItem } from '../components';
import TimelineBeam from './TimelineBeam';
import type { FullProject } from '../lib/projects';

export type JourneyStop = {
  date: string;
  title: string;
  description: string;
  tags?: string[];
  current?: boolean;
};

const ORG_URL = 'https://github.com/ThanhNguyxnOrg';
const ORG_BOARD = '/brand/org-github.jpg';

/** Second-life journey: dated stops left, sticky repo panel right. Dates are the sequence. */
export default function Journey({
  stops,
  repoCount,
  foundedAt,
  projects,
  limit,
}: {
  stops: JourneyStop[];
  repoCount: number;
  foundedAt: string;
  projects: FullProject[];
  limit?: number;
}) {
  const shown = limit ? stops.slice(0, limit) : stops;
  const [active, setActive] = useState(() => Math.max(0, shown.findIndex((s) => s.current)));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll('[data-stop]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.stop));
        }
      },
      { rootMargin: '-40% 0px -40% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [shown.length]);

  const stop = shown[active] ?? shown[0];
  const tag = stop?.tags?.[0];
  const project = tag ? projects.find((p) => p.name.toLowerCase() === tag.toLowerCase()) : undefined;
  const panel = project
    ? { image: project.image ?? ORG_BOARD, name: project.name, url: project.repoUrl, label: 'View repository' }
    : { image: ORG_BOARD, name: 'ThanhNguyxnOrg', url: ORG_URL, label: 'Visit organization' };

  return (
    <section id="journey" aria-labelledby="journey-title" className="scroll-mt-20 border-t border-border">
      <div ref={rootRef} className="relative mx-auto w-full max-w-page px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <TimelineBeam />
        <SectionHeader
          title={<span id="journey-title">Second lives.</span>}
          description="Where each project came from, and what it became. Thin histories stay thin: nothing here is invented."
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <Reveal className="max-w-reading lg:col-span-7">
            <Timeline>
              {shown.map((s, i) => (
                <div data-reveal data-stop={i} key={`${s.date}-${s.title}`}>
                  <TimelineItem date={s.date} title={s.title} description={s.description.replace('{count}', String(repoCount)).replace('{founded}', foundedAt)} tags={s.tags} current={s.current} />
                </div>
              ))}
            </Timeline>
          </Reveal>
          <aside aria-label="Currently reading" className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-24 overflow-hidden rounded-xl border border-border bg-surface transition-ui hover:border-border-strong">
              <img key={panel.image} src={panel.image} alt="" loading="lazy" decoding="async" className="aspect-[2/1] w-full object-cover" />
              <div className="flex flex-col gap-2 border-t border-border p-4">
                <p className="font-mono text-micro uppercase text-fg-muted tabular">
                  <span className="text-primary-text">{stop?.date}</span>
                  <span aria-hidden> · </span>
                  <span>
                    {shown.length > 0 ? `${active + 1} / ${shown.length}` : ''}
                  </span>
                </p>
                <p className="font-display text-title font-semibold text-balance text-fg">{stop?.title}</p>
                <div aria-hidden className="mt-1 flex items-center gap-2">
                  {shown.map((s, i) => (
                    <span
                      key={`${s.date}-${i}`}
                      className={
                        i === active
                          ? 'size-2 rotate-45 border border-highlight bg-highlight'
                          : 'size-1.5 rotate-45 border border-fg-subtle bg-transparent opacity-60'
                      }
                    />
                  ))}
                </div>
              </div>
              <a
                href={panel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 border-t border-border p-4 focus-ring"
              >
                <p className="font-mono text-label uppercase text-fg-muted">{panel.name}</p>
                <p className="inline-flex items-center gap-1 font-mono text-label text-primary-text">
                  {panel.label} <ArrowUpRight aria-hidden className="size-4" />
                </p>
              </a>
            </div>
          </aside>
        </div>
        {limit && stops.length > limit && (
          <div className="mt-10">
            <Button href="/journey" size="lg" variant="secondary">Full journey</Button>
          </div>
        )}
      </div>
    </section>
  );
}
