/** Motion guards: pure, testable. Components import these. */
export function shouldEnhance(reduced: boolean, width: number): boolean {
  return !reduced && width >= 768;
}

export function shouldTilt(reduced: boolean, finePointer: boolean): boolean {
  return !reduced && finePointer;
}
