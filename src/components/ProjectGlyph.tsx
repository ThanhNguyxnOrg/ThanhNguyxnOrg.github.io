import clsx from 'clsx';

export type GlyphAccent = 'primary' | 'secondary' | 'highlight';
export type GlyphPattern = 'orbit' | 'grid' | 'stack' | 'wave';

const accentVar: Record<GlyphAccent, string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  highlight: 'var(--color-highlight)',
};

/**
 * Generative SVG cover used when a project has no screenshot. Lightweight
 * (no WebGL), deterministic, and on-brand. One accent per glyph.
 */
export default function ProjectGlyph({
  pattern = 'orbit',
  accent = 'primary',
  className,
}: {
  pattern?: GlyphPattern;
  accent?: GlyphAccent;
  className?: string;
}) {
  const c = accentVar[accent];
  return (
    <div aria-hidden className={clsx('relative overflow-hidden bg-surface bg-blueprint', className)}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(70% 70% at 70% 30%, color-mix(in oklab, ${c} 22%, transparent), transparent 70%)` }} />
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {pattern === 'orbit' && (
          <g fill="none" stroke={c}>
            <circle cx="270" cy="110" r="90" strokeOpacity=".25" />
            <circle cx="270" cy="110" r="60" strokeOpacity=".5" />
            <ellipse cx="270" cy="110" rx="130" ry="34" strokeOpacity=".7" transform="rotate(-18 270 110)" />
            <circle cx="270" cy="110" r="14" fill={c} />
            <circle cx="160" cy="146" r="5" fill="var(--color-fg)" stroke="none" />
          </g>
        )}
        {pattern === 'grid' &&
          Array.from({ length: 30 }).map((_, i) => {
            const x = 150 + (i % 6) * 36;
            const y = 30 + Math.floor(i / 6) * 36;
            const on = [3, 8, 9, 14, 15, 16, 21, 27].includes(i);
            return <rect key={i} x={x} y={y} width="24" height="24" rx="3" fill={on ? c : 'none'} stroke={c} strokeOpacity={on ? 1 : 0.25} />;
          })}
        {pattern === 'stack' &&
          [0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${170 + i * 18} ${150 - i * 28} l70 -34 l70 34 l-70 34 z`}
              fill={i === 3 ? c : 'none'}
              fillOpacity={i === 3 ? 0.9 : 0}
              stroke={c}
              strokeOpacity={0.35 + i * 0.2}
            />
          ))}
        {pattern === 'wave' &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M0 ${120 + i * 14} C 100 ${40 + i * 18}, 220 ${200 - i * 10}, 400 ${90 + i * 16}`}
              fill="none"
              stroke={c}
              strokeOpacity={0.15 + i * 0.15}
            />
          ))}
      </svg>
    </div>
  );
}
