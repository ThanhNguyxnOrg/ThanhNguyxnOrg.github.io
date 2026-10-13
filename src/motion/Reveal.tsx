import { useRef, type ElementType, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { distance, duration, ease, MOTION_OK_QUERY, stagger as staggerTokens } from './tokens';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children marked with `data-reveal` in sequence. */
  stagger?: keyof typeof staggerTokens;
  /** `scroll` waits for viewport entry; `mount` plays immediately (hero only). */
  trigger?: 'scroll' | 'mount';
  y?: keyof typeof distance;
  /**
   * Entrance shape. `rise` (default) is the single y+fade used everywhere;
   * `settle` is a quieter scale .985→1 + small y for the Featured lead only.
   * Transform/opacity only; gated by MOTION_OK_QUERY like `rise`.
   */
  variant?: 'rise' | 'settle';
};

/**
 * The one entrance primitive of the system. Content is visible by default;
 * GSAP only animates *from* an offset state when motion is allowed, so
 * reduced-motion users and no-JS renders always see final content.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className,
  stagger = 'base',
  trigger = 'scroll',
  y = 'md',
  variant = 'rise',
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const marked = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current);
        const targets = marked.length ? marked : [scope.current!];
        if (variant === 'settle') {
          gsap.from(targets, {
            y: distance.sm,
            scale: 0.985,
            autoAlpha: 0,
            duration: duration.slow,
            ease: ease.out,
            stagger: staggerTokens[stagger],
            clearProps: 'transform,opacity,visibility',
            scrollTrigger:
              trigger === 'scroll' ? { trigger: scope.current, start: 'top 85%', once: true } : undefined,
          });
          return;
        }
        gsap.from(targets, {
          y: distance[y],
          autoAlpha: 0,
          duration: duration.slow,
          ease: ease.out,
          stagger: staggerTokens[stagger],
          clearProps: 'transform,opacity,visibility',
          scrollTrigger:
            trigger === 'scroll' ? { trigger: scope.current, start: 'top 85%', once: true } : undefined,
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
