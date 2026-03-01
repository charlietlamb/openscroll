import { storage } from '@wxt-dev/storage';
import { filterConfigs, isRecencyFilter, type FilterType } from './filters/config';

export type TimeUnit = 'hours' | 'days' | 'weeks';

export interface FilterState {
  enabled: boolean;
  value: number;
  unit?: TimeUnit;
}

export type FilterSettings = Record<FilterType, FilterState>;

export interface CooldownSettings {
  enabled: boolean;
  threshold: number; // Hidden tweets before cooldown triggers
  duration: number; // Cooldown duration in seconds
}

// Generate defaults from config
export const defaultSettings: FilterSettings = filterConfigs.reduce(
  (acc, config) => ({
    ...acc,
    [config.key]: {
      enabled: config.defaultEnabled,
      value: config.defaultValue,
      unit: isRecencyFilter(config) ? config.unit : undefined,
    },
  }),
  {} as FilterSettings
);

const filterSettingsRaw = storage.defineItem<Partial<FilterSettings>>(
  'local:filterSettings',
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
  'local:cooldownSettings',
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
