// Parse compact numbers like "2.5K", "1M", "500"
export function parseCompactNumber(text: string): number | null {
  const cleaned = text.trim().toUpperCase();
  if (!cleaned) return null;

  const match = cleaned.match(/^([\d.]+)([KMB])?$/);
  if (!match) return null;

  const num = parseFloat(match[1]);
  const suffix = match[2];

  if (isNaN(num)) return null;

  const multipliers: Record<string, number> = {
    K: 1_000,
    M: 1_000_000,
    B: 1_000_000_000,
  };

  return suffix ? num * multipliers[suffix] : num;
}
