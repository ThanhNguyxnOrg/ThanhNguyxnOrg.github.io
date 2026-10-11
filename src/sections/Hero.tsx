import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { Button, Container, GitHubMark, motionTokens } from '../components';
import type { FullProject } from '../lib/projects';

gsap.registerPlugin(useGSAP);
const { duration, ease, stagger, MOTION_OK_QUERY } = motionTokens;

const slots = [
  { x: 92, y: 96 },
  { x: 404, y: 70 },
  { x: 430, y: 330 },
  { x: 110, y: 380 },
  { x: 300, y: 390 },
];
const core = { x: 260, y: 220 };

function nodeRadius(stars: number) {
  if (stars >= 3) return 34;
  if (stars === 2) return 28;
  return 22;
}

/** Project map: five real top-starred repositories orbiting the practice. Size encodes stars, gold means a live demo exists, every node links out. */
function Constellation({ projects }: { projects: FullProject[] }) {
  const nodes = projects.slice(0, 5).map((p, i) => ({ p, ...slots[i % slots.length] }));
  return (
    <svg viewBox="0 0 520 460" className="h-auto w-full overflow-visible" aria-label="Map of top starred projects">
      <circle cx={core.x} cy={core.y} r="170" fill="none" stroke="var(--color-border)" strokeDasharray="2 6" />
      <circle cx={core.x} cy={core.y} r="110" fill="none" stroke="var(--color-border-strong)" />
      {nodes.map(({ p, x, y }) => (
        <path key={p.name} className="hero-link" d={`M${core.x} ${core.y} Q ${(core.x + x) / 2 + 30} ${(core.y + y) / 2 - 30} ${x} ${y}`} fill="none" stroke="var(--color-primary)" strokeOpacity=".7" strokeWidth="1.5" pathLength={1} strokeDasharray="1" />
      ))}
      {nodes.map(({ p, x, y }) => {
        const r = nodeRadius(p.stars);
        const c = p.demoUrl ? 'var(--color-primary)' : 'var(--color-secondary)';
        return (
          <a
            key={p.name}
            href={p.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.name} repository, ${p.stars} ${p.stars === 1 ? 'star' : 'stars'}${p.demoUrl ? ', live demo available' : ''}`}
            className="focus-ring rounded-sm"
          >
            <g className="hero-node" style={{ transformOrigin: `${x}px ${y}px` }}>
              <circle cx={x} cy={y} r={r} fill="var(--color-surface)" stroke={c} strokeWidth="1.5" />
              <circle cx={x} cy={y} r="4" fill={c} />
              <text x={x} y={y + r + 18} textAnchor="middle" fill="var(--color-fg-muted)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1">{p.name.toUpperCase()}</text>
              <text x={x} y={y + r + 34} textAnchor="middle" fill="var(--color-fg-subtle)" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">{p.stars} {p.stars === 1 ? 'STAR' : 'STARS'}</text>
            </g>
          </a>
        );
      })}
      <g className="hero-node" style={{ transformOrigin: `${core.x}px ${core.y}px` }}>
        <image href="/logo.png" x={core.x - 38} y={core.y - 29} width="76" height="57" preserveAspectRatio="xMidYMid meet" />
      </g>
    </svg>
  );
}

export default function Hero({ projects }: { projects: FullProject[] }) {
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
          <Constellation projects={projects} />
        </div>
      </Container>
    </div>
  );
}
