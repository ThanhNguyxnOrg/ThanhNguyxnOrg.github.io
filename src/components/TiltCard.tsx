import { useRef, type CSSProperties, type ReactNode, type MouseEvent } from 'react';
import { shouldTilt } from '../lib/enhance';

/** 3D tilt wrapper: rotate ±max deg on fine pointer only, static otherwise. */
export default function TiltCard({ children, max = 7 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (!shouldTilt(false, window.matchMedia('(pointer: fine)').matches)) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="transition-ui motion-reduce:transform-none"
      style={{ transformStyle: 'preserve-3d' } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Section glow: single radial layer following mouse via --mx/--my, static otherwise. */
export function GlowSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${Math.round(e.clientX - rect.left)}px`);
    el.style.setProperty('--my', `${Math.round(e.clientY - rect.top)}px`);
  };
  return (
    <div onMouseMove={onMove} data-glow className={`section-glow ${className}`}>
      {children}
    </div>
  );
}
