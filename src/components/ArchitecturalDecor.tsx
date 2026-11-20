import type { MouseEvent, ReactNode } from 'react';
import type { OrgProject } from '../data/orgData';
import { groupProjectsByCluster, type LanguageStat } from '../utils/projectLogic';

/**
 * Lightweight pointer-tracked specular surface (zero React state re-renders).
 * Updates --spot-x / --spot-y directly on the DOM node so CSS radial sheen
 * tracks the cursor smoothly like Vercel / Linear flagship surfaces.
 */
export function SpotlightSurface({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <div onMouseMove={handleMouseMove} className={`spotlight-surface ${className}`}>
      {children}
    </div>
  );
}

/**
 * Architectural full-width section seam with precision `+` registration
 * crosshairs aligned to the 1280px container, subtle center tick scale,
 * and optional amber-to-cyan filament glow.
 */
export function SectionSeam({ glow = false, label }: { glow?: boolean; label?: string }) {
  return (
    <div aria-hidden="true" className="relative h-px w-full bg-[#1E263B]/80">
      {glow && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/55 to-transparent" />
      )}
      <div className="pointer-events-none relative mx-auto h-full w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
        {/* Left registration crosshair */}
        <span className="absolute -top-[5px] left-4 font-mono text-[11px] leading-none text-[#475577] select-none sm:left-6 lg:left-10">
          +
        </span>

        {/* Center precision fulcrum diamond & optional coordinate micro-label */}
        <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 bg-[#07090F] px-3 sm:flex">
          <span className="h-1.5 w-px bg-[#2D3854]" />
          <span
            className={`inline-block size-1.5 rotate-45 border ${
              glow
                ? 'border-[#F59E0B]/80 bg-[#F59E0B]/25'
                : 'border-[#334155] bg-[#0D111C]'
            }`}
          />
          {label && (
            <span className="font-mono text-[10px] tracking-wider text-[#64748B]">{label}</span>
          )}
          <span className="h-1.5 w-px bg-[#2D3854]" />
        </div>

        {/* Right registration crosshair */}
        <span className="absolute -top-[5px] right-4 font-mono text-[11px] leading-none text-[#475577] select-none sm:right-6 lg:right-10">
          +
        </span>
      </div>
    </div>
  );
}

/**
 * Full-bleed architectural astrolabe wireframe arcs + subtle atmospheric veil
 * behind the Hero section so the left editorial column balances the 3D Astrolabe.
 */
export function HeroAmbientBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Subtle geometric concentric meridian arcs on the left canvas */}
      <svg
        viewBox="0 0 900 620"
        fill="none"
        className="absolute -top-24 -left-40 h-[640px] w-[900px] opacity-[0.22]"
      >
        <circle cx="290" cy="310" r="140" stroke="#1E263B" strokeWidth="1" />
        <circle
          cx="290"
          cy="310"
          r="235"
          stroke="#2D3854"
          strokeWidth="1"
          strokeDasharray="3 7"
        />
        <circle cx="290" cy="310" r="340" stroke="#1E263B" strokeWidth="0.9" />
        <path
          d="M 100 120 A 268 268 0 0 1 480 120"
          stroke="#F59E0B"
          strokeOpacity="0.4"
          strokeWidth="1"
          className="svg-dash-flow-slow"
        />
        <path d="M 290 20 V 600" stroke="#1E263B" strokeOpacity="0.65" strokeWidth="0.75" />
        <path d="M 10 310 H 720" stroke="#1E263B" strokeOpacity="0.65" strokeWidth="0.75" />
        <circle cx="290" cy="75" r="2.5" fill="#F59E0B" fillOpacity="0.6" />
        <circle cx="525" cy="310" r="2" fill="#38BDF8" fillOpacity="0.55" />
      </svg>

      {/* Soft top-left warm gold zenith haze */}
      <div
        className="absolute -top-36 left-1/4 h-[380px] w-[620px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.34) 0%, rgba(56, 189, 248, 0.08) 55%, transparent 100%)',
        }}
      />
    </div>
  );
}

/**
 * Radial-masked precision dot-matrix + soft ambient top light veil.
 */
export function DotMatrixBackdrop({
  align = 'center',
  tint = 'amber',
}: {
  align?: 'left' | 'center' | 'right';
  tint?: 'amber' | 'cyan';
}) {
  const posX = align === 'left' ? '18%' : align === 'right' ? '82%' : '50%';
  const glowColor =
    tint === 'amber'
      ? 'rgba(245, 158, 11, 0.09)'
      : 'rgba(56, 189, 248, 0.085)';

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="bg-dot-matrix absolute inset-0 opacity-60"
        style={{
          maskImage: `radial-gradient(ellipse 68% 58% at ${posX} 18%, black 0%, transparent 74%)`,
          WebkitMaskImage: `radial-gradient(ellipse 68% 58% at ${posX} 18%, black 0%, transparent 74%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 52% 40% at ${posX} 0%, ${glowColor}, transparent 72%)`,
        }}
      />
    </div>
  );
}

const CLUSTER_COLORS = ['#F59E0B', '#38BDF8', '#34D399', '#A78BFA'];

/**
 * 100% auto-synced domain cluster distribution ribbon for Featured Releases.
 * Derived dynamically from synced repositories (zero hardcoded counts).
 */
export function DomainDistributionRibbon({ projects }: { projects: OrgProject[] }) {
  const clusters = groupProjectsByCluster(projects);
  const safeTotal = Math.max(1, projects.length);

  return (
    <div className="mt-8 rounded-xl border border-[#1E263B]/90 bg-[#0A0E18]/90 px-4 py-3.5 sm:px-5">
      <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] text-[#A3A9BF] tabular-nums">
          {clusters.map((group, idx) => (
            <span key={group.cluster} className="inline-flex items-center gap-2">
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ backgroundColor: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] }}
              />
              <span className="text-[#E2E6F3]">{group.cluster}</span>
              <span className="text-[#64748B]">{group.items.length}</span>
            </span>
          ))}
        </div>
        <span className="font-mono text-[10px] text-[#64748B] tabular-nums whitespace-nowrap">
          Auto-clustered · {projects.length} repos
        </span>
      </div>

      {/* Crisp 3px proportional architectural spectrum */}
      <div
        aria-hidden="true"
        className="mt-3 flex h-[3px] w-full overflow-hidden rounded-full bg-[#141A29]"
      >
        {clusters.map((group, idx) => (
          <div
            key={group.cluster}
            style={{
              width: `${(group.items.length / safeTotal) * 100}%`,
              backgroundColor: CLUSTER_COLORS[idx % CLUSTER_COLORS.length],
            }}
            className="h-full border-r border-[#07090F] last:border-r-0"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Framed Linear/v0-grade animated geometric SVG illustrations for the 4
 * Operating Principles (Build, Explore, Evolve, Second Life).
 */
export function PrincipleDiagram({ index }: { index: number }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-[104px] w-full items-center justify-center overflow-hidden rounded-xl border border-[#1E263B]/90 bg-[#07090F]/95 px-3"
    >
      <div className="bg-dot-matrix pointer-events-none absolute inset-0 opacity-30" />

      {/* 01. Build — Modular architecture blocks with animated amber signal bus */}
      {index === 0 && (
        <svg viewBox="0 0 220 84" fill="none" className="relative z-10 h-full w-full">
          {/* Input modules */}
          <rect x="14" y="16" width="38" height="20" rx="4" stroke="#2D3854" strokeWidth="1" fill="#0B0F1A" />
          <rect x="14" y="48" width="38" height="20" rx="4" stroke="#2D3854" strokeWidth="1" fill="#0B0F1A" />
          <line x1="22" y1="26" x2="42" y2="26" stroke="#475577" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="22" y1="58" x2="38" y2="58" stroke="#475577" strokeWidth="1.2" strokeLinecap="round" />

          {/* Signal traces */}
          <path d="M52 26H74V42H88" stroke="#1E263B" strokeWidth="1.2" />
          <path d="M52 58H74V42H88" stroke="#1E263B" strokeWidth="1.2" />
          <path d="M52 26H74V42H88" stroke="#F59E0B" strokeWidth="1.2" className="svg-dash-flow" />
          <path d="M52 58H74V42H88" stroke="#38BDF8" strokeWidth="1.2" className="svg-dash-flow" />

          {/* Core compiled module */}
          <rect
            x="88"
            y="22"
            width="44"
            height="40"
            rx="6"
            fill="rgba(245,158,11,0.08)"
            stroke="#F59E0B"
            strokeOpacity="0.8"
            strokeWidth="1.25"
          />
          <rect x="97" y="31" width="26" height="22" rx="3" stroke="#FCD34D" strokeOpacity="0.45" strokeWidth="1" />
          <circle cx="110" cy="42" r="3" fill="#FCD34D" className="svg-pulse-node" />

          {/* Output shipping pipeline */}
          <path d="M132 42H164" stroke="#1E263B" strokeWidth="1.2" />
          <path d="M132 42H164" stroke="#FCD34D" strokeWidth="1.2" className="svg-dash-flow" />
          <rect x="164" y="24" width="42" height="15" rx="3.5" stroke="#38BDF8" strokeOpacity="0.5" fill="#0B0F1A" />
          <rect x="164" y="45" width="32" height="15" rx="3.5" stroke="#2D3854" fill="#0B0F1A" />
          <circle cx="172" cy="31.5" r="2" fill="#38BDF8" />
        </svg>
      )}

      {/* 02. Explore — Dual orbital probe vectors with precision reticle */}
      {index === 1 && (
        <svg viewBox="0 0 220 84" fill="none" className="relative z-10 h-full w-full">
          {/* Coordinate crosshair */}
          <line x1="110" y1="8" x2="110" y2="76" stroke="#1E263B" strokeWidth="0.9" />
          <line x1="36" y1="42" x2="184" y2="42" stroke="#1E263B" strokeWidth="0.9" />

          {/* Concentric orbit ellipses */}
          <ellipse
            cx="110"
            cy="42"
            rx="64"
            ry="22"
            transform="rotate(-14 110 42)"
            stroke="#38BDF8"
            strokeOpacity="0.45"
            strokeWidth="1.1"
          />
          <ellipse
            cx="110"
            cy="42"
            rx="64"
            ry="22"
            transform="rotate(-14 110 42)"
            stroke="#38BDF8"
            strokeWidth="1.2"
            className="svg-dash-flow-slow"
          />
          <ellipse
            cx="110"
            cy="42"
            rx="42"
            ry="15"
            transform="rotate(16 110 42)"
            stroke="#F59E0B"
            strokeOpacity="0.5"
            strokeWidth="1"
            strokeDasharray="3 4"
          />

          {/* Center core & probe satellites */}
          <circle cx="110" cy="42" r="7" fill="rgba(245,158,11,0.14)" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="110" cy="42" r="2.5" fill="#FCD34D" />
          <circle cx="168" cy="27" r="3" fill="#38BDF8" className="svg-pulse-node" />
          <circle cx="52" cy="56" r="2.5" fill="#F59E0B" />
          <circle cx="144" cy="54" r="2" fill="#94A3B8" />
        </svg>
      )}

      {/* 03. Evolve — Compound release curve with animated telemetry sweep */}
      {index === 2 && (
        <svg viewBox="0 0 220 84" fill="none" className="relative z-10 h-full w-full">
          {/* Reference horizontal guides */}
          <line x1="16" y1="68" x2="204" y2="68" stroke="#2D3854" strokeWidth="1" />
          <line x1="16" y1="48" x2="204" y2="48" stroke="#1E263B" strokeDasharray="2 4" strokeWidth="0.9" />
          <line x1="16" y1="28" x2="204" y2="28" stroke="#1E263B" strokeDasharray="2 4" strokeWidth="0.9" />

          {/* Area fill */}
          <path
            d="M20 62 C52 60, 68 50, 96 42 C126 34, 152 24, 196 14 V68 H20 Z"
            fill="url(#principle-evolve-grad)"
          />
          {/* Base curve + animated signal highlight */}
          <path
            d="M20 62 C52 60, 68 50, 96 42 C126 34, 152 24, 196 14"
            stroke="#F59E0B"
            strokeOpacity="0.7"
            strokeWidth="1.4"
          />
          <path
            d="M20 62 C52 60, 68 50, 96 42 C126 34, 152 24, 196 14"
            stroke="#38BDF8"
            strokeWidth="1.5"
            className="svg-dash-flow"
          />

          {/* Release checkpoints */}
          <circle cx="56" cy="55" r="2.5" fill="#0B0F1A" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="102" cy="40" r="2.8" fill="#0B0F1A" stroke="#FCD34D" strokeWidth="1.25" />
          <circle cx="150" cy="25" r="2.8" fill="#0B0F1A" stroke="#38BDF8" strokeWidth="1.25" />
          <circle cx="196" cy="14" r="4" fill="rgba(56,189,248,0.22)" stroke="#38BDF8" strokeWidth="1.3" className="svg-pulse-node" />
          <circle cx="196" cy="14" r="1.8" fill="#F4F5FA" />

          <defs>
            <linearGradient id="principle-evolve-grad" x1="108" y1="14" x2="108" y2="68" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" stopOpacity="0.22" />
              <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* 04. Second Life — Legacy blueprint transitioning into precision rebuilt core */}
      {index === 3 && (
        <svg viewBox="0 0 220 84" fill="none" className="relative z-10 h-full w-full">
          {/* Legacy prototype ring (dashed) */}
          <circle cx="48" cy="42" r="22" stroke="#334155" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="48" cy="42" r="12" stroke="#475577" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="48" cy="42" r="2.5" fill="#64748B" />

          {/* Animated rebuild bridge */}
          <path d="M74 42H132" stroke="#1E263B" strokeWidth="1.2" />
          <path d="M74 42H132" stroke="#F59E0B" strokeWidth="1.4" className="svg-dash-flow" />
          <path d="M126 37L132 42L126 47" stroke="#FCD34D" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />

          {/* Rebuilt precision concentric core */}
          <circle cx="168" cy="42" r="25" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" className="svg-orbit-spin" />
          <circle cx="168" cy="42" r="17" stroke="#F59E0B" strokeOpacity="0.75" strokeWidth="1.3" />
          <circle cx="168" cy="42" r="9" fill="rgba(245,158,11,0.14)" stroke="#FCD34D" strokeWidth="1.2" />
          <circle cx="168" cy="42" r="3" fill="#FCD34D" className="svg-pulse-node" />
        </svg>
      )}
    </div>
  );
}

/**
 * Clean architectural index preview inside the Archive Deep Dive card
 * — rendered 100% from real synced repositories.
 */
export function ArchiveMatrixPreview({ projects }: { projects: OrgProject[] }) {
  const topSample = [...projects]
    .sort((a, b) => b.stars - a.stars || b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, 3);

  return (
    <div
      aria-hidden="true"
      className="relative flex h-[132px] flex-col justify-between overflow-hidden rounded-xl border border-[#1E263B] bg-[#07090F]/90 p-3.5"
    >
      <div className="bg-dot-matrix pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative z-10 flex items-center justify-between border-b border-[#1E263B]/90 pb-2 font-mono text-[10px] text-[#868CA6]">
        <span>INDEX · GRID / CLUSTERS / TABLE</span>
        <span className="text-[#FCD34D] tabular-nums">{projects.length} entries</span>
      </div>
      <div className="relative z-10 mt-1.5 divide-y divide-[#1E263B]/60 font-mono text-[11px]">
        {topSample.map((repo, idx) => (
          <div key={repo.slug} className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-[#475577] tabular-nums">0{idx + 1}</span>
              <span className="truncate font-medium text-[#E2E6F3]">{repo.name}</span>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-[10px] text-[#868CA6] tabular-nums">
              <span>{repo.language}</span>
              <span className="text-[#FCD34D]">★ {repo.stars}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-[#07090F] to-transparent" />
    </div>
  );
}

const SPECTRUM_PALETTE = [
  '#F59E0B',
  '#38BDF8',
  '#FCD34D',
  '#34D399',
  '#818CF8',
  '#64748B',
];

/**
 * Real data-driven proportional language spectrum preview inside the
 * Stack & Telemetry Deep Dive card.
 */
export function LanguageSpectrumPreview({
  stats,
  totalRepos,
  downloads30d,
}: {
  stats: LanguageStat[];
  totalRepos: number;
  downloads30d: number;
}) {
  const topSix = stats.slice(0, 6);
  const safeTotal = Math.max(1, totalRepos);

  return (
    <div
      aria-hidden="true"
      className="relative flex h-[132px] flex-col justify-between overflow-hidden rounded-xl border border-[#1E263B] bg-[#07090F]/90 p-3.5"
    >
      <div className="bg-dot-matrix pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative z-10 flex items-center justify-between border-b border-[#1E263B]/90 pb-2 font-mono text-[10px] text-[#868CA6]">
        <span>STACK SPECTRUM · 6H CI SYNC</span>
        <span className="text-[#38BDF8] tabular-nums">{downloads30d} npm / 30d</span>
      </div>

      {/* Segmented proportional spectrum bar + inline legend */}
      <div className="relative z-10 space-y-2.5 py-1">
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#141A29]">
          {topSix.map((item, idx) => (
            <div
              key={item.language}
              style={{
                width: `${Math.max(4, (item.count / safeTotal) * 100)}%`,
                backgroundColor: SPECTRUM_PALETTE[idx % SPECTRUM_PALETTE.length],
              }}
              className="h-full border-r border-[#07090F] last:border-r-0"
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 font-mono text-[10px] text-[#A3A9BF] tabular-nums">
          {topSix.slice(0, 4).map((item, idx) => (
            <span key={item.language} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ backgroundColor: SPECTRUM_PALETTE[idx % SPECTRUM_PALETTE.length] }}
              />
              <span>{item.language}</span>
              <span className="text-[#64748B]">{Math.round((item.count / safeTotal) * 100)}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom telemetry micro-bar matching ArchiveMatrixPreview rhythm */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#1E263B]/60 pt-1.5 font-mono text-[10px] text-[#64748B] tabular-nums">
        <span>
          {stats.length} languages · {totalRepos} repositories
        </span>
        <span className="text-[#34D399]">sync-org-data.yml</span>
      </div>
    </div>
  );
}

/**
 * Bespoke architectural orbital wireframe & radial meridian backdrop for the
 * Closing Spotlight Callout (Vercel / Stripe / v0 editorial signature).
 */
export function ClosingOrbitalBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 320"
      fill="none"
      className="pointer-events-none absolute -top-12 -right-24 h-[380px] w-[640px] opacity-45"
    >
      <circle cx="440" cy="170" r="78" stroke="#F59E0B" strokeOpacity="0.28" strokeWidth="1" />
      <circle
        cx="440"
        cy="170"
        r="134"
        stroke="#2D3854"
        strokeWidth="1"
        strokeDasharray="4 6"
        className="svg-orbit-spin"
      />
      <circle
        cx="440"
        cy="170"
        r="196"
        stroke="#38BDF8"
        strokeOpacity="0.22"
        strokeWidth="1"
        strokeDasharray="2 8"
        className="svg-orbit-spin-reverse"
      />
      <circle cx="440" cy="170" r="258" stroke="#1E263B" strokeWidth="0.85" />
      <line x1="180" y1="170" x2="640" y2="170" stroke="#1E263B" strokeWidth="0.8" />
      <line x1="440" y1="0" x2="440" y2="320" stroke="#1E263B" strokeWidth="0.8" />
      <circle cx="440" cy="92" r="3" fill="#F59E0B" className="svg-pulse-node" />
      <circle cx="306" cy="170" r="2.5" fill="#38BDF8" />
    </svg>
  );
}
