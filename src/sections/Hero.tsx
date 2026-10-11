import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { Button, Container, GitHubMark, motionTokens } from '../components';
import type { FullProject } from '../lib/projects';

gsap.registerPlugin(useGSAP);
const { duration, ease, stagger, MOTION_OK_QUERY } = motionTokens;

const RINGS = [
  { r: 110, duration: 36 },
  { r: 170, duration: 60 },
];
// [ringIndex, angleDeg]: two most-starred orbit inside, rest outside.
const ORBITS: [number, number][] = [
  [0, 160],
  [0, 340],
  [1, 90],
  [1, 215],
  [1, 335],
];
const core = { x: 260, y: 220 };

function nodeRadius(stars: number) {
  if (stars >= 3) return 34;
  if (stars === 2) return 28;
  return 22;
}

/** Project map: five real top-starred repositories orbiting the practice. Size encodes stars, gold means a live demo exists, every node links out. */
function Constellation({ projects }: { projects: FullProject[] }) {
  const nodes = projects.slice(0, 5).map((p, i) => {
    const [ringIdx, deg] = ORBITS[i % ORBITS.length];
    const ring = RINGS[ringIdx];
    const a = (deg * Math.PI) / 180;
    return {
      p,
      ring: ringIdx === 0 ? ('inner' as const) : ('outer' as const),
      x: core.x + ring.r * Math.cos(a),
      y: core.y + ring.r * Math.sin(a),
    };
  });
  return (
    <svg viewBox="0 0 520 460" className="constellation h-auto w-full overflow-visible" aria-label="Map of top starred projects">
      <defs>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={core.x} cy={core.y} r="170" fill="none" stroke="var(--color-border)" strokeDasharray="2 6" />
      <circle cx={core.x} cy={core.y} r="110" fill="none" stroke="var(--color-border-strong)" />
      <circle cx={core.x} cy={core.y} r="64" fill="url(#sunGlow)" />
      {nodes.map(({ p, ring, x, y }) => {
        const r = nodeRadius(p.stars);
        const c = p.demoUrl ? 'var(--color-primary)' : 'var(--color-secondary)';
        return (
          <g key={p.name} className="rotor" data-ring={ring}>
            <g transform={`translate(${x} ${y})`}>
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} repository, ${p.stars} ${p.stars === 1 ? 'star' : 'stars'}${p.demoUrl ? ', live demo available' : ''}`}
                className="spinner focus-ring rounded-sm"
              >
                <g className="hero-node">
                  <circle cx={0} cy={0} r={r} fill={c} fillOpacity={0.08} stroke={c} strokeWidth="1.5" />
                  <text x={0} y={r + 18} textAnchor="middle" fill="var(--color-fg-muted)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1" stroke="var(--color-bg)" strokeWidth="3" style={{ paintOrder: 'stroke' }}>{p.name.toUpperCase()}</text>
                  <text x={0} y={r + 34} textAnchor="middle" fill="var(--color-fg-subtle)" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1" stroke="var(--color-bg)" strokeWidth="3" style={{ paintOrder: 'stroke' }}>{p.stars} {p.stars === 1 ? 'STAR' : 'STARS'}</text>
                </g>
              </a>
            </g>
          </g>
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
  const spins = useRef<ReturnType<typeof gsap.to>[]>([]);
  const [paused, setPaused] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const tl = gsap.timeline({ defaults: { ease: ease.out } });
        tl.from('.hero-word', { yPercent: 110, duration: duration.epic, stagger: stagger.loose })
          .from('.hero-fade', { y: 16, autoAlpha: 0, duration: duration.slow, stagger: stagger.base }, '-=0.6')
          .from('.hero-node', { scale: 0, autoAlpha: 0, duration: duration.slow, ease: ease.snap, stagger: stagger.base }, 0.5);
        gsap.utils.toArray<SVGGElement>('.rotor').forEach((rot) => {
          const dur = rot.dataset.ring === 'inner' ? RINGS[0].duration : RINGS[1].duration;
          spins.current.push(gsap.to(rot, { rotation: '+=360', duration: dur, repeat: -1, ease: 'none', svgOrigin: `${core.x} ${core.y}` }));
        });
        gsap.utils.toArray<SVGAElement>('.spinner').forEach((sp) => {
          const rot = sp.closest('.rotor');
          const dur = rot?.getAttribute('data-ring') === 'inner' ? RINGS[0].duration : RINGS[1].duration;
          spins.current.push(gsap.to(sp, { rotation: '-=360', duration: dur, repeat: -1, ease: 'none', transformOrigin: '50% 50%' }));
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  const toggleOrbits = () => {
    const next = !paused;
    setPaused(next);
    spins.current.forEach((t) => gsap.to(t, { timeScale: next ? 0 : 1, duration: 0.4, overwrite: 'auto' }));
  };

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
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={toggleOrbits}
              aria-pressed={paused}
              className="inline-flex min-h-11 items-center rounded-md border border-border px-4 font-mono text-label uppercase text-fg-muted transition-ui hover:border-border-strong hover:text-fg focus-ring motion-reduce:hidden"
            >
              {paused ? 'Play orbits' : 'Pause orbits'}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
