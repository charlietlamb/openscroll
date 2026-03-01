import type { FilterSettings } from './storage';
import { parseCompactNumber } from './utils/parse';
import { getTweetCells, hideTweet, showTweet, isTweetHidden } from './utils/dom';

// Filter function type - returns true if tweet should be hidden
type TweetFilter = (cell: Element, settings: FilterSettings) => boolean;

// Extract tweet timestamp
function getTweetTimestamp(cell: Element): Date | null {
  const timeEl = cell.querySelector('time[datetime]');
  if (!timeEl) return null;
  const datetime = timeEl.getAttribute('datetime');
  if (!datetime) return null;
  return new Date(datetime);
}

// Extract tweet view count
function getTweetViews(cell: Element): number | null {
  const analyticsLink = cell.querySelector('a[href*="/analytics"][aria-label*="views"]');
  if (!analyticsLink) return null;
  const viewSpan = analyticsLink.querySelector('span');
  if (!viewSpan) return null;
  return parseCompactNumber(viewSpan.textContent || '');
}

// Extract tweet metric by data-testid
function getTweetMetric(cell: Element, testId: string): number | null {
  const button = cell.querySelector(`button[data-testid="${testId}"]`);
  if (!button) return null;
  const span = button.querySelector('span');
  if (!span || !span.textContent?.trim()) return 0;
  return parseCompactNumber(span.textContent) ?? 0;
}

function getTweetComments(cell: Element): number | null {
  return getTweetMetric(cell, 'reply');
}

function getTweetReposts(cell: Element): number | null {
  return getTweetMetric(cell, 'retweet');
}

function getTweetLikes(cell: Element): number | null {
  return getTweetMetric(cell, 'like');
}

// Individual filters
const ageFilter: TweetFilter = (cell, settings) => {
  if (!settings.enabled) return false;
  const timestamp = getTweetTimestamp(cell);
  if (!timestamp) return false;

  const MS_PER_UNIT = { hours: 3600000, days: 86400000, weeks: 604800000 };
  const thresholdMs = settings.threshold * MS_PER_UNIT[settings.unit];
  return Date.now() - timestamp.getTime() > thresholdMs;
};

const minViewsFilter: TweetFilter = (cell, settings) => {
  if (!settings.minViewsEnabled) return false;
  const views = getTweetViews(cell);
  if (views === null) return false;
  return views < settings.minViews;
};

const minCommentsFilter: TweetFilter = (cell, settings) => {
  if (!settings.minCommentsEnabled) return false;
  const comments = getTweetComments(cell);
  if (comments === null) return false;
  return comments < settings.minComments;
};

const minRepostsFilter: TweetFilter = (cell, settings) => {
  if (!settings.minRepostsEnabled) return false;
  const reposts = getTweetReposts(cell);
  if (reposts === null) return false;
  return reposts < settings.minReposts;
};

const minLikesFilter: TweetFilter = (cell, settings) => {
  if (!settings.minLikesEnabled) return false;
  const likes = getTweetLikes(cell);
  if (likes === null) return false;
  return likes < settings.minLikes;
};

// All active filters
const filters: TweetFilter[] = [
  ageFilter,
  minViewsFilter,
  minCommentsFilter,
  minRepostsFilter,
  minLikesFilter,
];

// Check if cell is a tweet (has timestamp)
function isTweet(cell: Element): boolean {
  return getTweetTimestamp(cell) !== null;
}

// Main filter function
export function filterTweets(settings: FilterSettings): number {
  const cells = getTweetCells();
  let hiddenCount = 0;

  cells.forEach((cell) => {
    if (!isTweet(cell)) {
      if (isTweetHidden(cell)) showTweet(cell);
      return;
    }

    const shouldHide = filters.some((filter) => filter(cell, settings));

    if (shouldHide) {
      if (!isTweetHidden(cell)) hideTweet(cell);
      hiddenCount++;
    } else {
      if (isTweetHidden(cell)) showTweet(cell);
    }
  });

  return hiddenCount;
}

// Re-export for content script
export { createTweetObserver, startObserving } from './utils/dom';
