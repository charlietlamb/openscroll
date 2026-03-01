// Parse compact numbers like "2.5K", "1M", "500"
const COMPACT_NUMBER_REGEX = /^([\d.]+)([KMB])?$/;

export function parseCompactNumber(text: string): number | null {
  const cleaned = text.trim().toUpperCase();
  if (!cleaned) {
    return null;
  }

  const match = COMPACT_NUMBER_REGEX.exec(cleaned);
  if (!match) {
    return null;
  }

  const num = Number.parseFloat(match[1]);
  const suffix = match[2];

  if (Number.isNaN(num)) {
    return null;
  }

  const multipliers: Record<string, number> = {
    K: 1000,
    M: 1_000_000,
    B: 1_000_000_000,
  };

  return suffix ? num * multipliers[suffix] : num;
}
