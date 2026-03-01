import type { TimeUnit } from '../storage';

export type FilterType = 'recency' | 'views' | 'comments' | 'reposts' | 'likes';

interface BaseFilterConfig {
  key: FilterType;
  label: string;
  defaultEnabled: boolean;
  defaultValue: number;
}

interface RecencyFilterConfig extends BaseFilterConfig {
  key: 'recency';
  unit: TimeUnit;
}

interface MetricFilterConfig extends BaseFilterConfig {
  key: Exclude<FilterType, 'recency'>;
  testId?: string; // data-testid for button metrics
}

export type FilterConfig = RecencyFilterConfig | MetricFilterConfig;

export const filterConfigs: FilterConfig[] = [
  { key: 'recency', label: 'Recency', defaultEnabled: true, defaultValue: 24, unit: 'hours' },
  { key: 'views', label: 'Minimum views', defaultEnabled: false, defaultValue: 1000 },
  { key: 'comments', label: 'Minimum comments', defaultEnabled: false, defaultValue: 10, testId: 'reply' },
  { key: 'reposts', label: 'Minimum reposts', defaultEnabled: false, defaultValue: 10, testId: 'retweet' },
  { key: 'likes', label: 'Minimum likes', defaultEnabled: false, defaultValue: 100, testId: 'like' },
];

export const isRecencyFilter = (config: FilterConfig): config is RecencyFilterConfig =>
  config.key === 'recency';

export const isMetricFilter = (config: FilterConfig): config is MetricFilterConfig =>
  config.key !== 'recency';
