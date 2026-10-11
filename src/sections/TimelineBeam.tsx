import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../motion/tokens';

gsap.registerPlugin(ScrollTrigger);

/** Vertical beam drawing with scroll scrub. Static full spine under reduced-motion. */
export default function TimelineBeam() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const path = el.querySelector('path');
    if (!path) return;
    if (prefersReducedMotion()) return;
    const len = (path as SVGPathElement).getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const st = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: '#journey', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
    });
    return () => {
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute bottom-0 left-4 top-0 w-[2px]">
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 2 1000">
        <line x1="1" y1="0" x2="1" y2="1000" stroke="#1F2537" strokeWidth="2" />
        <path d="M1 0 V1000" fill="none" stroke="#f59e0b" strokeWidth="2" />
      </svg>
    </div>
  );
}
