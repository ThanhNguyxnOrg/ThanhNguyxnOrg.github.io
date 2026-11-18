import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { GlyphAccent, GlyphPattern } from '../data/orgData';

interface InteractiveCard3DProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * Spatial 3D Perspective Card with Hooke's Law Spring Physics
 * and Fluent-inspired Cursor-Tracking Reveal Border & Specular Sheen.
 */
export function InteractiveCard3D({
  children,
  className = '',
  maxTilt = 4.5,
}: InteractiveCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const borderGlowRef = useRef<HTMLDivElement>(null);

  const physicsRef = useRef({
    rafId: 0,
    active: false,
    targetRx: 0,
    targetRy: 0,
    currentRx: 0,
    currentRy: 0,
    velRx: 0,
    velRy: 0,
    targetScale: 1,
    currentScale: 1,
    gx: 50,
    gy: 50,
    targetGlare: 0,
    currentGlare: 0,
  });

  useEffect(() => {
    const p = physicsRef.current;
    return () => {
      if (p.rafId) cancelAnimationFrame(p.rafId);
    };
  }, []);

  const startSpringLoop = () => {
    const p = physicsRef.current;
    if (p.active) return;
    p.active = true;

    const stiffness = 0.14;
    const damping = 0.78;

    const step = () => {
      const el = cardRef.current;
      if (!el) {
        p.active = false;
        return;
      }

      const forceRx = (p.targetRx - p.currentRx) * stiffness;
      const forceRy = (p.targetRy - p.currentRy) * stiffness;
      p.velRx = (p.velRx + forceRx) * damping;
      p.velRy = (p.velRy + forceRy) * damping;
      p.currentRx += p.velRx;
      p.currentRy += p.velRy;

      p.currentScale += (p.targetScale - p.currentScale) * 0.16;
      p.currentGlare += (p.targetGlare - p.currentGlare) * 0.16;

      el.style.transform = `perspective(1200px) rotateX(${p.currentRx.toFixed(3)}deg) rotateY(${p.currentRy.toFixed(3)}deg) scale3d(${p.currentScale.toFixed(4)}, ${p.currentScale.toFixed(4)}, 1)`;

      if (glareRef.current) {
        glareRef.current.style.opacity = p.currentGlare.toFixed(3);
        glareRef.current.style.background = `radial-gradient(460px circle at ${p.gx}% ${p.gy}%, rgba(252, 211, 77, 0.2), rgba(56, 189, 248, 0.06) 45%, transparent 72%)`;
      }

      if (borderGlowRef.current) {
        borderGlowRef.current.style.opacity = Math.min(1, p.currentGlare * 5.6).toFixed(3);
        borderGlowRef.current.style.background = `radial-gradient(320px circle at ${p.gx}% ${p.gy}%, rgba(245, 158, 11, 0.58), rgba(56, 189, 248, 0.2) 40%, transparent 72%)`;
      }

      const settled =
        Math.abs(p.targetRx - p.currentRx) < 0.01 &&
        Math.abs(p.targetRy - p.currentRy) < 0.01 &&
        Math.abs(p.velRx) < 0.01 &&
        Math.abs(p.velRy) < 0.01 &&
        Math.abs(p.targetGlare - p.currentGlare) < 0.005;

      if (settled) {
        p.active = false;
        if (p.targetScale === 1) {
          el.style.transform =
            'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      } else {
        p.rafId = requestAnimationFrame(step);
      }
    };

    p.rafId = requestAnimationFrame(step);
  };

  const canHoverTilt = () => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || !canHoverTilt()) return;

    const rect = el.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const p = physicsRef.current;
    p.targetRy = (relX - 0.5) * maxTilt * 2;
    p.targetRx = (0.5 - relY) * maxTilt * 2;
    p.targetScale = 1.008;
    p.gx = Math.round(relX * 100);
    p.gy = Math.round(relY * 100);
    p.targetGlare = 0.14;
    startSpringLoop();
  };

  const handleMouseLeave = () => {
    const p = physicsRef.current;
    if (!p.active && p.currentRx === 0 && p.currentRy === 0) return;
    p.targetRx = 0;
    p.targetRy = 0;
    p.targetScale = 1;
    p.targetGlare = 0;
    startSpringLoop();
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group/tilt relative min-w-0 rounded-2xl ${className}`}
    >
      {/* Fluent Reveal Cursor-Tracking Border Highlight */}
      <div
        ref={borderGlowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[1px] z-0 rounded-2xl opacity-0"
      />
      <div className="relative z-10 h-full w-full">{children}</div>
      {/* Specular Surface Sheen */}
      <div
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0"
      />
    </div>
  );
}

/**
 * Resilient Project Artwork component: renders the verified local brand cover
 * with a deterministic SVG architectural blueprint fallback so images never break.
 */
export function ProjectArtwork({
  title,
  image,
  logo,
  pattern = 'orbit',
  accent = 'primary',
  className = '',
  compact = false,
  logoBare = false,
  showLogoOverlay = false,
}: {
  title: string;
  image: string | null;
  logo?: string | null;
  pattern?: GlyphPattern;
  accent?: GlyphAccent;
  className?: string;
  compact?: boolean;
  logoBare?: boolean;
  showLogoOverlay?: boolean;
}) {
  const lowerSlug = title.trim().toLowerCase();
  const compactSlug = lowerSlug.replace(/[^a-z0-9]+/g, '');
  const imageCandidates = Array.from(
    new Set(
      [
        image,
        `/brand/${lowerSlug}.png`,
        `/brand/${title}.png`,
        `/brand/${lowerSlug}.webp`,
        `/brand/${lowerSlug}.jpg`,
        `/brand/${lowerSlug}.svg`,
        compactSlug ? `/brand/${compactSlug}.png` : null,
      ].filter((v): v is string => Boolean(v)),
    ),
  );
  const logoCandidates = Array.from(
    new Set(
      [
        logo,
        `/logos/${lowerSlug}.png`,
        `/logos/${lowerSlug}.svg`,
        `/logos/${title}.png`,
        `/logos/${title}.svg`,
        `/logos/${lowerSlug}.webp`,
        compactSlug ? `/logos/${compactSlug}.png` : null,
        compactSlug ? `/logos/${compactSlug}.svg` : null,
      ].filter((v): v is string => Boolean(v)),
    ),
  );

  const [imgIndex, setImgIndex] = useState(0);
  const [logoIndex, setLogoIndex] = useState(0);

  const activeImage = imgIndex < imageCandidates.length ? imageCandidates[imgIndex] : null;
  const activeLogo = logoIndex < logoCandidates.length ? logoCandidates[logoIndex] : null;

  const strokeColor =
    accent === 'highlight' ? '#FCD34D' : accent === 'primary' ? '#F59E0B' : '#38BDF8';
  const safeId = title.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <div
      className={`group/art relative overflow-hidden bg-[#0A0E19] bg-blueprint-grid ${className}`}
    >
      {/* Procedural Architectural SVG Fallback / Underlay */}
      <svg
        viewBox="0 0 400 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-80"
      >
        <defs>
          <radialGradient id={`glow-${safeId}`} cx="70%" cy="30%" r="70%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="220" fill={`url(#glow-${safeId})`} />
        {pattern === 'orbit' && (
          <g fill="none" stroke={strokeColor}>
            <circle cx="260" cy="110" r="82" strokeOpacity="0.24" />
            <circle cx="260" cy="110" r="52" strokeOpacity="0.48" />
            <ellipse
              cx="260"
              cy="110"
              rx="120"
              ry="32"
              strokeOpacity="0.68"
              transform="rotate(-16 260 110)"
            />
            <circle cx="260" cy="110" r="12" fill={strokeColor} />
          </g>
        )}
        {pattern === 'grid' &&
          Array.from({ length: 24 }).map((_, i) => {
            const x = 140 + (i % 6) * 36;
            const y = 32 + Math.floor(i / 6) * 38;
            const active = [2, 7, 8, 13, 14, 15, 20].includes(i);
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="24"
                height="24"
                rx="6"
                fill={active ? strokeColor : 'none'}
                fillOpacity={active ? 0.72 : 0}
                stroke={strokeColor}
                strokeOpacity={active ? 1 : 0.25}
              />
            );
          })}
        {pattern === 'stack' &&
          [0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${160 + i * 16} ${145 - i * 24} l68 -32 l68 32 l-68 32 z`}
              fill={i === 3 ? strokeColor : 'none'}
              fillOpacity={i === 3 ? 0.85 : 0}
              stroke={strokeColor}
              strokeOpacity={0.35 + i * 0.2}
            />
          ))}
        {pattern === 'wave' &&
          [0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M0 ${115 + i * 14} C 110 ${45 + i * 16}, 230 ${190 - i * 12}, 400 ${85 + i * 15}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeOpacity={0.2 + i * 0.16}
            />
          ))}
      </svg>

      {/* Real Brand Image Asset */}
      {activeImage && (
        <img
          src={activeImage}
          alt={`${title} project preview`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgIndex((prev) => prev + 1)}
          className={`relative z-10 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/tilt:scale-[1.03] ${
            compact ? 'object-contain p-2' : 'object-cover'
          }`}
        />
      )}

      {/* Optional Single Logo Emblem Overlay (only enabled for showcase banners) */}
      {showLogoOverlay && !compact && activeLogo && (
        <div
          className={`pointer-events-none absolute bottom-3 left-3 z-30 flex items-center justify-center overflow-hidden rounded-lg ${
            logoBare
              ? 'size-10 bg-transparent p-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]'
              : 'size-8 border border-[#2D3854]/90 bg-[#07090F]/90 p-1 shadow-lg'
          }`}
        >
          <img
            src={activeLogo}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setLogoIndex((prev) => prev + 1)}
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {/* Measured Gradient Scrim */}
      {!compact && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/3 bg-gradient-to-t from-[#07090F]/80 via-[#07090F]/25 to-transparent"
        />
      )}
    </div>
  );
}
