import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Stat, StatGroup } from '../components';
import { MOTION_OK_QUERY, duration, ease } from '../motion/tokens';
import { formatCount } from '../lib/format';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type MetricTotals = {
  repos: number;
  stars: number;
  downloads30d: number;
  demos: number;
};

/** Honest numbers with fetch date. Counts up once on entry; static without JS. */
export default function MetricsBand({ totals, fetchedAt }: { totals: MetricTotals; fetchedAt: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const nums = gsap.utils.toArray<HTMLElement>('[data-count]', scope.current);
        nums.forEach((el) => {
          const target = Number(el.dataset.count ?? 0);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: duration.slow,
            ease: ease.out,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              el.textContent = formatCount(Math.round(obj.v));
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  const items = [
    { value: totals.repos, label: 'Repositories', detail: 'public' },
    { value: totals.stars, label: 'Stars', detail: 'across the org' },
    { value: totals.downloads30d, label: 'npm downloads', detail: 'last 30 days' },
    { value: totals.demos, label: 'Live demos', detail: `snapshot ${fetchedAt}` },
  ];

  return (
    <div ref={scope}>
      <StatGroup>
        {items.map((item) => (
          <Stat
            key={item.label}
            value={<span data-count={item.value}>{formatCount(item.value)}</span>}
            label={item.label}
            detail={item.detail}
            accent="primary"
          />
        ))}
      </StatGroup>
    </div>
  );
}
