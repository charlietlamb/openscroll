import { storage } from "@wxt-dev/storage";
import {
  type FilterType,
  filterConfigs,
  isRecencyFilter,
} from "./filters/config";

export type TimeUnit = "hours" | "days" | "weeks";

// Stats storage
export interface StatsData {
  hiddenCount: number;
  lastUpdated: number;
  seenTweetIds: string[];
  shownCount: number;
}

const defaultStats: StatsData = {
  hiddenCount: 0,
  shownCount: 0,
  seenTweetIds: [],
  lastUpdated: Date.now(),
};

// Arc blocks extension session storage from the content-script context.
export const statsStorage = storage.defineItem<StatsData>("local:stats", {
  fallback: defaultStats,
});

export interface FilterState {
  enabled: boolean;
  unit?: TimeUnit;
  value: number;
}

export type FilterSettings = Record<FilterType, FilterState>;

export interface CooldownSettings {
  duration: number; // Cooldown duration in seconds
  enabled: boolean;
  threshold: number; // Hidden tweets before cooldown triggers
}

// Generate defaults from config
export const defaultSettings: FilterSettings = Object.fromEntries(
  filterConfigs.map((config) => [
    config.key,
    {
      enabled: config.defaultEnabled,
      value: config.defaultValue,
      unit: isRecencyFilter(config) ? config.unit : undefined,
    },
  ])
) as FilterSettings;

const filterSettingsRaw = storage.defineItem<Partial<FilterSettings>>(
  "local:filterSettings",
  {
    fallback: defaultSettings,
  }
);

// Wrapper that merges stored values with defaults to handle new filters
export const filterSettings = {
  async getValue(): Promise<FilterSettings> {
    const stored = await filterSettingsRaw.getValue();
    return { ...defaultSettings, ...stored };
  },
  async setValue(value: FilterSettings): Promise<void> {
    await filterSettingsRaw.setValue(value);
  },
  watch(callback: (value: FilterSettings) => void): () => void {
    return filterSettingsRaw.watch((stored) => {
      callback({ ...defaultSettings, ...stored });
    });
  },
};

// Cooldown settings
export const defaultCooldownSettings: CooldownSettings = {
  enabled: true,
  threshold: 100,
  duration: 30,
};

const cooldownSettingsRaw = storage.defineItem<Partial<CooldownSettings>>(
  "local:cooldownSettings",
  {
    fallback: defaultCooldownSettings,
  }
);

export const cooldownSettings = {
  async getValue(): Promise<CooldownSettings> {
    const stored = await cooldownSettingsRaw.getValue();
    return { ...defaultCooldownSettings, ...stored };
  },
  async setValue(value: CooldownSettings): Promise<void> {
    await cooldownSettingsRaw.setValue(value);
  },
  watch(callback: (value: CooldownSettings) => void): () => void {
    return cooldownSettingsRaw.watch((stored) => {
      callback({ ...defaultCooldownSettings, ...stored });
    });
  },
};
