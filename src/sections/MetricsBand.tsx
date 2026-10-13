import { Stat, StatGroup } from '../components';
import CountUp from '../components/CountUp';

export type MetricTotals = {
  repos: number;
  stars: number;
  downloads30d: number;
  demos: number;
};

/** Star distribution sparkline. Static SVG, no motion; number alongside so color is never the only signal. */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 120;
  const h = 28;
  const pad = 3;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={`Star distribution across repos, highest ${max}`}
      className="mt-2 block text-primary-text"
    >
      <title>{`Stars per repo: ${values.join(', ')}`}</title>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

/** Honest numbers with fetch date. Counts up once on entry; static without JS. */
export default function MetricsBand({
  totals,
  fetchedAt,
  stars,
}: {
  totals: MetricTotals;
  fetchedAt: string;
  stars?: number[];
}) {
  const spark = (stars ?? []).filter((n) => Number.isFinite(n));
  const showSpark = spark.length >= 2;
  const items = [
    { value: totals.downloads30d, label: 'npm downloads', detail: 'last 30 days' },
    { value: totals.demos, label: 'Live demos', detail: `snapshot ${fetchedAt}` },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface/60 px-6 py-8 md:px-10">
      <StatGroup>
        <Stat
          value={<CountUp value={totals.repos} />}
          label="Repositories"
          detail="public"
          accent="primary"
        />
        <div className="relative flex flex-col gap-2 pl-5">
          <span aria-hidden className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-0.5 bg-primary" />
          <dt className="order-2 font-mono text-label uppercase text-fg-muted">Stars</dt>
          <dd className="order-1 font-display text-display-lg font-semibold tabular-nums text-fg">
            <CountUp value={totals.stars} />
          </dd>
          <dd className="order-3 text-body-sm text-fg-subtle">
            across the org
            {showSpark && <Sparkline values={spark} />}
          </dd>
        </div>
        {items.map((item) => (
          <Stat
            key={item.label}
            value={<CountUp value={item.value} />}
            label={item.label}
            detail={item.detail}
            accent="primary"
          />
        ))}
      </StatGroup>
    </div>
  );
}
