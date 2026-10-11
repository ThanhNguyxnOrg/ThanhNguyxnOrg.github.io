import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { Button, Container, GitHubMark, motionTokens } from '../components';

gsap.registerPlugin(useGSAP);
const { duration, ease, stagger, MOTION_OK_QUERY } = motionTokens;

const nodes = [
  { id: 'tools', x: 92, y: 96, r: 30, label: 'tools', c: 'var(--color-primary)' },
  { id: 'libs', x: 404, y: 70, r: 22, label: 'libraries', c: 'var(--color-secondary)' },
  { id: 'apps', x: 430, y: 330, r: 34, label: 'apps', c: 'var(--color-primary)' },
  { id: 'exp', x: 110, y: 380, r: 24, label: 'experiments', c: 'var(--color-highlight)' },
];
const core = { x: 260, y: 220 };

/** "Constellation" motif: the practice at the core, linked to what it ships, plus one unformed next node. */
function Constellation() {
  return (
    <svg viewBox="0 0 520 460" className="h-auto w-full overflow-visible" aria-hidden>
      <circle cx={core.x} cy={core.y} r="170" fill="none" stroke="var(--color-border)" strokeDasharray="2 6" />
      <circle cx={core.x} cy={core.y} r="110" fill="none" stroke="var(--color-border-strong)" />
      {nodes.map((n) => (
        <path key={n.id} className="hero-link" d={`M${core.x} ${core.y} Q ${(core.x + n.x) / 2 + 30} ${(core.y + n.y) / 2 - 30} ${n.x} ${n.y}`} fill="none" stroke={n.c} strokeOpacity=".7" strokeWidth="1.5" pathLength={1} strokeDasharray="1" />
      ))}
      <path className="hero-link" d={`M${core.x} ${core.y} L 470 190`} fill="none" stroke="var(--color-highlight)" strokeWidth="1.5" strokeDasharray="4 5" />
      {nodes.map((n) => (
        <g key={n.id} className="hero-node" style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
          <circle cx={n.x} cy={n.y} r={n.r} fill="var(--color-surface)" stroke={n.c} strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r="4" fill={n.c} />
          <text x={n.x} y={n.y + n.r + 18} textAnchor="middle" fill="var(--color-fg-muted)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1">{n.label.toUpperCase()}</text>
        </g>
      ))}
      <g className="hero-node" style={{ transformOrigin: '470px 190px' }}>
        <rect x="458" y="178" width="24" height="24" fill="none" stroke="var(--color-highlight)" strokeDasharray="3 3" transform="rotate(45 470 190)" />
        <rect x="465" y="185" width="10" height="10" fill="var(--color-highlight)" className="animate-pulse motion-reduce:animate-none" transform="rotate(45 470 190)" />
        <text x="470" y="232" textAnchor="middle" fill="var(--color-highlight)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1">NEXT</text>
      </g>
      <g className="hero-node" style={{ transformOrigin: `${core.x}px ${core.y}px` }}>
        <image href="/logo.png" x={core.x - 38} y={core.y - 29} width="76" height="57" preserveAspectRatio="xMidYMid meet" />
      </g>
    </svg>
  );
}

export default function Hero() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const tl = gsap.timeline({ defaults: { ease: ease.out } });
        tl.from('.hero-word', { yPercent: 110, duration: duration.epic, stagger: stagger.loose })
          .from('.hero-fade', { y: 16, autoAlpha: 0, duration: duration.slow, stagger: stagger.base }, '-=0.6')
          .from('.hero-link', { strokeDashoffset: 1, duration: duration.epic, ease: ease.inOut, stagger: stagger.tight }, 0.2)
          .from('.hero-node', { scale: 0, autoAlpha: 0, duration: duration.slow, ease: ease.snap, stagger: stagger.base }, 0.5);
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="absolute inset-0 bg-aurora" />
      <div aria-hidden className="absolute inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" />
      <Container className="relative grid gap-12 pb-16 pt-16 md:pb-24 md:pt-24 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <h1 className="font-display text-display-2xl font-bold uppercase">
            {['Build.', 'Explore.', 'Evolve.'].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.06em]">
                <span className={i === 1 ? 'hero-word block pl-[0.6em] text-fg-soft' : 'hero-word block'}>{w}</span>
              </span>
            ))}
          </h1>
          <p className="hero-fade max-w-measure text-body-lg text-fg-muted">
            Independent technology practice building developer tools, AI workflows, and open source utilities. Documented, preserved, and rebuilt in the open.
          </p>
          <div className="hero-fade flex flex-wrap gap-3">
            <Button href="#projects" size="lg" iconEnd={<ArrowRight />}>Browse projects</Button>
            <Button href="https://github.com/ThanhNguyxnOrg" size="lg" variant="secondary" target="_blank" rel="noopener noreferrer" iconStart={<GitHubMark className="size-4" />}>
              Visit GitHub
            </Button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <Constellation />
        </div>
      </Container>
    </div>
  );
}
