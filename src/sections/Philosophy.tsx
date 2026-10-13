import { Reveal, SectionHeader } from '../components';

const principles = [
  { verb: 'Build', line: 'Useful beats impressive.', body: 'Projects aim at real problems and ship as working software.', tone: 'text-primary-text' },
  { verb: 'Explore', line: 'Ideas start as experiments.', body: 'Small prototypes test whether an idea deserves to become a tool.', tone: 'text-secondary' },
  { verb: 'Evolve', line: 'Releases compound.', body: 'Good work keeps improving through issues and honest critique.', tone: 'text-highlight' },
  { verb: 'Second life', line: 'Good projects get a cleaner home.', body: 'Older work is preserved, rebuilt, and given a second life.', tone: 'text-fg' },
];

/** Principles of the practice, not a dated history. */
export default function Philosophy() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-20 border-t border-border bg-surface/40">
      <div aria-hidden className="bg-blueprint-fine absolute inset-0 mask-y-from-70%"></div>
      <div className="relative mx-auto w-full max-w-page px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <hr className="divider-orn mb-14" data-glyph="◆" />
        <SectionHeader title={<span id="about-title">How the practice works.</span>} description="TNORG is not tied to one product category. These are the principles every project follows." />
        <Reveal as="ol" stagger="base" className="principles mt-14 grid border-t border-border md:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li data-reveal key={p.verb} className={`relative flex flex-col gap-4 border-b border-border py-8 md:px-6 lg:border-b-0${i % 2 === 0 ? ' md:border-r lg:border-r' : ''}${i === 1 ? ' lg:border-r' : ''}${i === 0 ? ' md:pl-0' : ''}`}>
              <span className={`font-display text-display-lg font-bold ${p.tone}`}>{p.verb}</span>
              <span className="font-display text-title font-semibold text-fg">{p.line}</span>
              <span className="principle-body tombstone text-body-sm text-fg-muted">{p.body}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
