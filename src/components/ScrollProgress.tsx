import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../motion/tokens';

gsap.registerPlugin(ScrollTrigger);

/** Fixed gold progress bar: scaleX(progress), hidden under reduced-motion. */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const bar = ref.current;
    if (!bar) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (bar) bar.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#f59e0b] to-[#fcd34d] motion-reduce:hidden"
    />
  );
}
