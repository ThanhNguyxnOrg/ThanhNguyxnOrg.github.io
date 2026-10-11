import { Stat, StatGroup } from '../components';
import CountUp from '../components/CountUp';

export type MetricTotals = {
  repos: number;
  stars: number;
  downloads30d: number;
  demos: number;
};

/** Honest numbers with fetch date. Counts up once on entry; static without JS. */
export default function MetricsBand({ totals, fetchedAt }: { totals: MetricTotals; fetchedAt: string }) {
  const items = [
    { value: totals.repos, label: 'Repositories', detail: 'public' },
    { value: totals.stars, label: 'Stars', detail: 'across the org' },
    { value: totals.downloads30d, label: 'npm downloads', detail: 'last 30 days' },
    { value: totals.demos, label: 'Live demos', detail: `snapshot ${fetchedAt}` },
  ];

  return (
    <div>
      <StatGroup>
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
