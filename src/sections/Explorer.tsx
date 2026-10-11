import { useMemo, useState } from 'react';
import { SearchX, X } from 'lucide-react';
import { Button, EmptyState, FilterGroup, SearchField, SectionHeader, Tag, ToggleChip } from '../components';
import type { FullProject } from '../lib/projects';
import { ProjectActions, ProjectVisual } from '../site/ProjectBits';

type Sort = 'default' | 'az';

export default function Explorer({ projects }: { projects: FullProject[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [tags, setTags] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('default');

  const categories = useMemo(() => [...new Set(projects.map((p) => p.category))], [projects]);
  const allTags = useMemo(() => [...new Set(projects.flatMap((p) => p.topics))].sort(), [projects]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        tags.every((t) => p.topics.includes(t)) &&
        (!q || `${p.name} ${p.blurb} ${p.language}`.toLowerCase().includes(q)),
    );
    return sort === 'az' ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list;
  }, [projects, query, category, tags, sort]);

  const active = [
    ...(query.trim() ? [{ key: 'q', label: `“${query.trim()}”`, clear: () => setQuery('') }] : []),
    ...(category !== 'all' ? [{ key: 'c', label: category, clear: () => setCategory('all') }] : []),
    ...tags.map((t) => ({ key: `t-${t}`, label: `#${t}`, clear: () => setTags((s) => s.filter((x) => x !== t)) })),
  ];
  const reset = () => { setQuery(''); setCategory('all'); setTags([]); setSort('default'); };

  return (
    <section id="archive" aria-labelledby="archive-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-page px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <SectionHeader title={<span id="archive-title">The full index.</span>} description="Search and filter every project record. Same verified data source as the featured section." />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:col-span-4 lg:self-start" aria-label="Filters">
            <SearchField label="Search" value={query} onValueChange={setQuery} placeholder="Name or summary…" />
            <div className="flex flex-col gap-3">
              <span className="font-mono text-label uppercase text-fg-muted">Category</span>
              <FilterGroup label="Category" value={category} onChange={setCategory} className="lg:flex-wrap" options={[{ value: 'all', label: 'All', count: projects.length }, ...categories.map((c) => ({ value: c, label: c, count: projects.filter((p) => p.category === c).length }))]} />
            </div>
            {allTags.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="font-mono text-label uppercase text-fg-muted">Technology and topic</span>
                <div role="group" aria-label="Tags" className="flex flex-wrap gap-2">
                  {allTags.map((t) => (
                    <ToggleChip key={t} pressed={tags.includes(t)} onPressedChange={(on) => setTags((s) => (on ? [...s, t] : s.filter((x) => x !== t)))}>{t}</ToggleChip>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <span className="font-mono text-label uppercase text-fg-muted">Sort</span>
              <FilterGroup label="Sort" value={sort} onChange={(v) => setSort(v as Sort)} options={[{ value: 'default', label: 'Top starred' }, { value: 'az', label: 'A to Z' }]} />
            </div>
          </aside>

          <div className="flex flex-col gap-5 lg:col-span-8">
            <div className="flex min-h-11 flex-wrap items-center gap-2 border-b border-border pb-4">
              <span className="mr-2 font-mono text-label uppercase text-fg-muted" aria-live="polite">
                {results.length} of {projects.length} projects
              </span>
              {active.map((a) => (
                <button key={a.key} type="button" onClick={a.clear} className="inline-flex h-8 items-center gap-1.5 rounded-pill bg-fg px-3 text-body-sm font-medium text-bg transition-ui hover:bg-fg-soft focus-ring" aria-label={`Remove filter ${a.label}`}>
                  {a.label} <X aria-hidden className="size-3.5" />
                </button>
              ))}
              {active.length > 0 && <Button variant="ghost" size="sm" onClick={reset} className="ml-auto">Reset filters</Button>}
            </div>

            {results.length === 0 ? (
              <EmptyState icon={<SearchX />} title="Nothing in the lab matches" description="Try a different term or remove a filter." action={<Button variant="secondary" size="sm" onClick={reset}>Reset filters</Button>} />
            ) : (
              <ol className="flex flex-col divide-y divide-border">
                {results.map((p) => (
                  <li key={p.name} className="group grid gap-5 py-6 sm:grid-cols-[8rem_1fr] md:gap-8">
                    <ProjectVisual title={p.name} glyph={{ pattern: p.pattern, accent: p.accent }} label={false} className="hidden aspect-square overflow-hidden rounded-md border border-border sm:block" />
                    <div className="flex flex-col gap-3">
                      <p className="font-display text-title font-semibold text-fg">{p.name}</p>
                      <p className="max-w-reading text-body-sm text-fg-muted">{p.blurb}</p>
                      {p.topics.length > 0 && <div className="flex flex-wrap gap-1.5">{p.topics.slice(0, 6).map((t) => <Tag key={t}>{t}</Tag>)}</div>}
                      <div className="pt-1"><ProjectActions repoUrl={p.repoUrl} demoUrl={p.demoUrl} size="sm" /></div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
