/** Motion tokens - mirror the CSS custom properties in styles/tokens.css. GSAP uses seconds. */
export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.6,
  epic: 1,
} as const;

/** GSAP ease strings matched to the CSS cubic-bezier tokens. */
export const ease = {
  out: 'expo.out', // --ease-out-expo
  inOut: 'power4.inOut', // --ease-in-out-quint
  snap: 'back.out(1.6)', // --ease-snap
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

/** Entrance distances (px) - keep small; motion conveys arrival, not travel. */
export const distance = {
  sm: 12,
  md: 24,
  lg: 48,
} as const;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const MOTION_OK_QUERY = '(prefers-reduced-motion: no-preference)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
