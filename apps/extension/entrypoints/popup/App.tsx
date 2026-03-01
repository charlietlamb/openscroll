import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterRow } from '@/components/ui/filter-row';
import { Separator } from '@/components/ui/separator';
import {
  filterSettings,
  cooldownSettings,
  defaultSettings,
  defaultCooldownSettings,
  type FilterSettings,
  type FilterState,
  type TimeUnit,
  type CooldownSettings,
} from '@/lib/storage';
import { filterConfigs, isRecencyFilter, type FilterType } from '@/lib/filters/config';

function App() {
  const [settings, setSettings] = useState<FilterSettings>(defaultSettings);
  const [cooldown, setCooldown] = useState<CooldownSettings>(defaultCooldownSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([filterSettings.getValue(), cooldownSettings.getValue()]).then(
      ([filterValue, cooldownValue]) => {
        setSettings(filterValue);
        setCooldown(cooldownValue);
        setLoading(false);
      }
    );
  }, []);

  const updateFilter = async (key: FilterType, updates: Partial<FilterState>) => {
    const newSettings = {
      ...settings,
      [key]: { ...settings[key], ...updates },
    };
    setSettings(newSettings);
    await filterSettings.setValue(newSettings);
  };

  const updateCooldown = async (updates: Partial<CooldownSettings>) => {
    const newCooldown = { ...cooldown, ...updates };
    setCooldown(newCooldown);
    await cooldownSettings.setValue(newCooldown);
  };

  if (loading) {
    return (
      <div className="w-72 min-h-[100px] p-3 font-sans">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-72 min-h-[100px] p-3 space-y-4 font-sans">
      <h1 className="text-base text-foreground">OpenScroll</h1>

      <div className="space-y-4">
        {filterConfigs.map((config) => {
          const state = settings[config.key];

          return (
            <FilterRow
              key={config.key}
              label={config.label}
              enabled={state.enabled}
              onToggle={(enabled) => updateFilter(config.key, { enabled })}
            >
              {isRecencyFilter(config) ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={state.value}
                    onChange={(e) =>
                      updateFilter(config.key, { value: parseInt(e.target.value) || 1 })
                    }
                    className="w-20"
                  />
                  <Select
                    value={state.unit}
                    onValueChange={(unit: TimeUnit) =>
                      updateFilter(config.key, { unit })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">hours</SelectItem>
                      <SelectItem value="days">days</SelectItem>
                      <SelectItem value="weeks">weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Input
                  type="number"
                  min={0}
                  value={state.value}
                  onChange={(e) =>
                    updateFilter(config.key, { value: parseInt(e.target.value) || 0 })
                  }
                  className="w-full"
                />
              )}
            </FilterRow>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Filtered tweets are hidden from your timeline.
      </p>

      <Separator className="my-4" />

      <FilterRow
        label="Rate limit protection"
        enabled={cooldown.enabled}
        onToggle={(enabled) => updateCooldown({ enabled })}
      >
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            value={cooldown.threshold}
            onChange={(e) =>
              updateCooldown({ threshold: parseInt(e.target.value) || 1 })
            }
            className="w-20"
            placeholder="100"
          />
          <Input
            type="number"
            min={1}
            value={cooldown.duration}
            onChange={(e) =>
              updateCooldown({ duration: parseInt(e.target.value) || 1 })
            }
            className="w-20"
            placeholder="30"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          hidden tweets / seconds
        </p>
      </FilterRow>
    </div>
  );
}

export default App;
