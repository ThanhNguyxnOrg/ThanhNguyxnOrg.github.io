const ITEMS = ['TypeScript', 'Astro', 'GSAP', 'Tailwind', 'React', 'Zod', 'npm', 'GitHub Pages'];

/** Single tech marquee: CSS-only loop, duplicate aria-hidden, static grid under reduced-motion. */
export default function TechMarquee() {
  const row = (hidden: boolean) =>
    hidden ? (
      <div aria-hidden="true" className="flex shrink-0 items-center gap-8 pr-8">
        {ITEMS.map((t) => (
          <span key={t} className="font-mono text-label uppercase text-fg-subtle">
            <span className="mr-2 text-primary-text">◆</span>
            {t}
          </span>
        ))}
      </div>
    ) : (
      <div className="flex shrink-0 items-center gap-8 pr-8">
        {ITEMS.map((t) => (
          <span key={t} className="font-mono text-label uppercase text-fg-subtle">
            <span className="mr-2 text-primary-text">◆</span>
            {t}
          </span>
        ))}
      </div>
    );
  return (
    <div className="overflow-hidden border-b border-border mask-x-from-85% mask-x-to-95%" role="presentation">
      <div className="marquee-track flex w-max py-4 motion-reduce:[animation:none]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
