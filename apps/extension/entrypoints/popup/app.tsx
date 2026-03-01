import { Logo } from "@openscroll/ui/components/brand/logo";
import { NumberInput } from "@openscroll/ui/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@openscroll/ui/components/ui/select";
import { Separator } from "@openscroll/ui/components/ui/separator";
import { useEffect, useState } from "react";
import { FilterRow } from "@/components/ui/filter-row";
import {
  type FilterType,
  filterConfigs,
  isRecencyFilter,
} from "@/lib/filters/config";
import {
  type CooldownSettings,
  cooldownSettings,
  defaultCooldownSettings,
  defaultSettings,
  type FilterSettings,
  type FilterState,
  filterSettings,
  type TimeUnit,
} from "@/lib/storage";

interface Stats {
  hiddenCount: number;
  shownCount: number;
}

function isXDomain(url: string | undefined): boolean {
  if (!url) {
    return false;
  }
  try {
    const hostname = new URL(url).hostname;
    return hostname === "x.com" || hostname === "twitter.com";
  } catch {
    return false;
  }
}

function App() {
  const [settings, setSettings] = useState<FilterSettings>(defaultSettings);
  const [cooldown, setCooldown] = useState<CooldownSettings>(
    defaultCooldownSettings
  );
  const [stats, setStats] = useState<Stats>({ hiddenCount: 0, shownCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isOnX, setIsOnX] = useState(false);

  useEffect(() => {
    Promise.all([filterSettings.getValue(), cooldownSettings.getValue()]).then(
      ([filterValue, cooldownValue]) => {
        setSettings(filterValue);
        setCooldown(cooldownValue);
        setLoading(false);
      }
    );

    // Check if current tab is on x.com
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0];
      const onX = isXDomain(tab?.url);
      setIsOnX(onX);

      if (onX && tab?.id) {
        browser.tabs
          .sendMessage(tab.id, { type: "GET_STATS" })
          .then((response: Stats | undefined) => {
            if (response) {
              setStats(response);
            }
          })
          .catch(() => {
            // Content script not loaded on this page
          });
      }
    });

    // Listen for stats updates from content script
    const listener = (message: { type: string } & Stats) => {
      if (message.type === "UPDATE_STATS") {
        setStats({
          hiddenCount: message.hiddenCount,
          shownCount: message.shownCount,
        });
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  const updateFilter = async (
    key: FilterType,
    updates: Partial<FilterState>
  ) => {
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
      <div className="min-h-[100px] w-72 p-3 font-sans">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!isOnX) {
    return (
      <div className="min-h-[100px] w-72 space-y-4 p-3 font-sans">
        <div className="flex items-center gap-2">
          <Logo className="text-foreground" size={20} />
          <h1 className="text-base text-foreground">OpenScroll</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Navigate to x.com to use OpenScroll.
        </p>
      </div>
    );
  }

  const totalTweets = stats.shownCount + stats.hiddenCount;

  return (
    <div className="min-h-[100px] w-72 space-y-4 p-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="text-foreground" size={20} />
          <h1 className="text-base text-foreground">OpenScroll</h1>
        </div>
        {totalTweets > 0 && (
          <p className="text-muted-foreground text-xs">
            {stats.shownCount} shown / {stats.hiddenCount} hidden
          </p>
        )}
      </div>

      <div className="space-y-4">
        {filterConfigs.map((config) => {
          const state = settings[config.key];

          return (
            <FilterRow
              enabled={state.enabled}
              key={config.key}
              label={config.label}
              onToggle={(enabled) => updateFilter(config.key, { enabled })}
            >
              {isRecencyFilter(config) ? (
                <div className="flex gap-2">
                  <NumberInput
                    className="w-20"
                    minValue={1}
                    onChange={(value) =>
                      updateFilter(config.key, { value: value || 1 })
                    }
                    value={state.value}
                  />
                  <Select
                    onValueChange={(unit) => {
                      if (unit) {
                        updateFilter(config.key, { unit: unit as TimeUnit });
                      }
                    }}
                    value={state.unit}
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
                <NumberInput
                  className="w-full"
                  minValue={0}
                  onChange={(value) =>
                    updateFilter(config.key, { value: value || 0 })
                  }
                  value={state.value}
                />
              )}
            </FilterRow>
          );
        })}
      </div>

      <p className="text-muted-foreground text-xs">
        Filtered tweets are hidden from your timeline.
      </p>

      <Separator className="my-4" />

      <FilterRow
        enabled={cooldown.enabled}
        label="Rate limit protection"
        onToggle={(enabled) => updateCooldown({ enabled })}
      >
        <div className="flex gap-2">
          <NumberInput
            className="w-20"
            minValue={1}
            onChange={(value) => updateCooldown({ threshold: value || 1 })}
            value={cooldown.threshold}
          />
          <NumberInput
            className="w-20"
            minValue={1}
            onChange={(value) => updateCooldown({ duration: value || 1 })}
            value={cooldown.duration}
          />
        </div>
        <p className="mt-1 text-muted-foreground text-xs">
          hidden tweets / seconds
        </p>
      </FilterRow>
    </div>
  );
}

export default App;
