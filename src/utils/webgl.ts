type ContextProbe = (name: string) => unknown;

export function supportsWebGL(
  getContext: ContextProbe = (name) => document.createElement('canvas').getContext(name),
): boolean {
  for (const name of ['webgl2', 'webgl', 'experimental-webgl']) {
    try {
      const context = getContext(name) as WebGLRenderingContext | null;
      if (context) {
        context.getExtension('WEBGL_lose_context')?.loseContext();
        return true;
      }
    } catch {
      // Context access can be blocked by browser policy.
    }
  }
  return false;
}

export function createRendererOrFallback<T>(supported: boolean, create: () => T): T | null {
  if (!supported) return null;
  try {
    return create();
  } catch {
    return null;
  }
}
