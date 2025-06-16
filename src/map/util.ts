export function lerp(start: number, end: number, fraction: number): number {
  return start + (end - start) * fraction;
}
