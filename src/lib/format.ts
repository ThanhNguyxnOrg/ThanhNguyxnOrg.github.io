export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}
