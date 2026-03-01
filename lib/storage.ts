import { storage } from '@wxt-dev/storage';

export type TimeUnit = 'hours' | 'days' | 'weeks';

export interface FilterSettings {
  enabled: boolean;
  threshold: number;
  unit: TimeUnit;
  minViewsEnabled: boolean;
  minViews: number;
  minCommentsEnabled: boolean;
  minComments: number;
  minRepostsEnabled: boolean;
  minReposts: number;
  minLikesEnabled: boolean;
  minLikes: number;
}

export const defaultSettings: FilterSettings = {
  enabled: true,
  threshold: 24,
  unit: 'hours',
  minViewsEnabled: false,
  minViews: 1000,
  minCommentsEnabled: false,
  minComments: 10,
  minRepostsEnabled: false,
  minReposts: 10,
  minLikesEnabled: false,
  minLikes: 100,
};

export const filterSettings = storage.defineItem<FilterSettings>(
  'local:filterSettings',
  {
    fallback: defaultSettings,
  }
);
