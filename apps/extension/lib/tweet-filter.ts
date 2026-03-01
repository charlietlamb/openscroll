import {
  filterConfigs,
  isMetricFilter,
  isRecencyFilter,
} from "./filters/config";
import type { CooldownSettings, FilterSettings, TimeUnit } from "./storage";
import {
  getTweetCells,
  hideTweet,
  isTweetHidden,
  showTweet,
} from "./utils/dom";
import { parseCompactNumber } from "./utils/parse";

// Cooldown state
let consecutiveHides = 0;
let cooldownUntil = 0;
let cooldownCallback: (() => void) | null = null;

export function isInCooldown(): boolean {
  return Date.now() < cooldownUntil;
}

export function getCooldownRemaining(): number {
  return Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
}

export function resetCooldown(): void {
  consecutiveHides = 0;
  cooldownUntil = 0;
}

function getRandomizedDuration(baseDuration: number): number {
  // Add ±30% randomness to the duration
  const variance = baseDuration * 0.3;
  const randomOffset = (Math.random() * 2 - 1) * variance;
  return Math.max(1, baseDuration + randomOffset);
}

function triggerCooldown(duration: number, onCooldownEnd?: () => void): void {
  const actualDuration = getRandomizedDuration(duration);
  cooldownUntil = Date.now() + actualDuration * 1000;
  consecutiveHides = 0;
  cooldownCallback = onCooldownEnd || null;

  if (cooldownCallback) {
    setTimeout(() => {
      cooldownUntil = 0;
      cooldownCallback?.();
      cooldownCallback = null;
    }, actualDuration * 1000);
  }
}

const MS_PER_UNIT: Record<TimeUnit, number> = {
  hours: 3_600_000,
  days: 86_400_000,
  weeks: 604_800_000,
};

function getTweetTimestamp(cell: Element): Date | null {
  const timeEl = cell.querySelector("time[datetime]");
  if (!timeEl) {
    return null;
  }
  const datetime = timeEl.getAttribute("datetime");
  if (!datetime) {
    return null;
  }
  return new Date(datetime);
}

function getTweetViews(cell: Element): number | null {
  const link = cell.querySelector('a[href*="/analytics"][aria-label*="views"]');
  if (!link) {
    return null;
  }
  const span = link.querySelector("span");
  if (!span) {
    return null;
  }
  return parseCompactNumber(span.textContent || "");
}

function getTweetMetric(cell: Element, testId: string): number | null {
  const button = cell.querySelector(`button[data-testid="${testId}"]`);
  if (!button) {
    return null;
  }
  const span = button.querySelector("span");
  if (!span?.textContent?.trim()) {
    return 0;
  }
  return parseCompactNumber(span.textContent) ?? 0;
}

function isTweet(cell: Element): boolean {
  return getTweetTimestamp(cell) !== null;
}

function shouldHideTweet(cell: Element, settings: FilterSettings): boolean {
  for (const config of filterConfigs) {
    const state = settings[config.key];
    if (!state.enabled) {
      continue;
    }

    if (isRecencyFilter(config)) {
      const timestamp = getTweetTimestamp(cell);
      if (!(timestamp && state.unit)) {
        continue;
      }
      const thresholdMs = state.value * MS_PER_UNIT[state.unit];
      if (Date.now() - timestamp.getTime() > thresholdMs) {
        return true;
      }
    } else if (isMetricFilter(config)) {
      const value = config.testId
        ? getTweetMetric(cell, config.testId)
        : getTweetViews(cell);
      if (value !== null && value < state.value) {
        return true;
      }
    }
  }
  return false;
}

export interface FilterResult {
  cooldownRemaining: number;
  hiddenCount: number;
  inCooldown: boolean;
}

export function filterTweets(
  settings: FilterSettings,
  cooldown?: CooldownSettings,
  onCooldownEnd?: () => void
): FilterResult {
  // If in cooldown, skip filtering but return current state
  if (isInCooldown()) {
    const cells = getTweetCells();
    let hiddenCount = 0;
    for (const cell of cells) {
      if (isTweetHidden(cell)) {
        hiddenCount++;
      }
    }
    return {
      hiddenCount,
      inCooldown: true,
      cooldownRemaining: getCooldownRemaining(),
    };
  }

  const cells = getTweetCells();
  let hiddenCount = 0;
  let newHidesThisPass = 0;

  for (const cell of cells) {
    if (!isTweet(cell)) {
      if (isTweetHidden(cell)) {
        showTweet(cell);
      }
      continue;
    }

    const shouldHide = shouldHideTweet(cell, settings);

    if (shouldHide) {
      if (!isTweetHidden(cell)) {
        hideTweet(cell);
        newHidesThisPass++;
      }
      hiddenCount++;
    } else {
      if (isTweetHidden(cell)) {
        showTweet(cell);
      }
      // Reset consecutive count when we show a tweet (user is seeing content)
      consecutiveHides = 0;
    }
  }

  // Track consecutive hides for cooldown
  consecutiveHides += newHidesThisPass;

  // Check if cooldown should trigger
  if (cooldown?.enabled && consecutiveHides >= cooldown.threshold) {
    triggerCooldown(cooldown.duration, onCooldownEnd);
    return {
      hiddenCount,
      inCooldown: true,
      cooldownRemaining: cooldown.duration,
    };
  }

  return {
    hiddenCount,
    inCooldown: false,
    cooldownRemaining: 0,
  };
}

export {
  createTweetObserver,
  startObserving,
  stopObserving,
} from "./utils/dom";
