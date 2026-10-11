import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../motion/tokens';
import { shouldEnhance } from '../lib/enhance';

export { shouldEnhance };

type Star = { x: number; y: number; r: number; phase: number; speed: number };

/** Capped canvas starfield: twinkle via opacity sine, 1 shooting star. Static when reduced-motion. */
export default function StarCanvas({ density = 150 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (prefersReducedMotion() || window.innerWidth < 768) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible && !raf) raf = requestAnimationFrame(frame);
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width * dpr));
      h = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = (seed: number) => {
      const x = Math.sin(seed * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    const stars: Star[] = Array.from({ length: density }, (_, i) => ({
      x: rand(i + 1),
      y: rand(i + 1001),
      r: i % 8 === 0 ? 1.6 : 1,
      phase: rand(i + 2001) * Math.PI * 2,
      speed: 0.5 + rand(i + 3001),
    }));
    let meteor = { x: 0.8, y: 0.1, t: 0 };
    let last = performance.now();

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.fillStyle = '#080b14';
      ctx.fillRect(0, 0, w, h);
      const t = now / 1000;
      for (const s of stars) {
        const tw = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.globalAlpha = tw;
        ctx.fillStyle = '#F4F5FA';
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      meteor.t += dt;
      if (meteor.t > 7) meteor = { x: 0.55 + rand(Math.floor(t)) * 0.35, y: 0.05, t: 0 };
      const mx = (meteor.x - meteor.t * 0.09) * w;
      const my = (meteor.y + meteor.t * 0.045) * h;
      if (meteor.t < 1.2) {
        const grad = ctx.createLinearGradient(mx, my, mx + 60 * dpr, my - 24 * dpr);
        grad.addColorStop(0, 'rgba(252,211,77,0.9)');
        grad.addColorStop(1, 'rgba(252,211,77,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx + 60 * dpr, my - 24 * dpr);
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
