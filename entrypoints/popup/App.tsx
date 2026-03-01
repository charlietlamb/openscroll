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
import {
  filterSettings,
  defaultSettings,
  type FilterSettings,
  type TimeUnit,
} from '@/lib/storage';

function App() {
  const [settings, setSettings] = useState<FilterSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    filterSettings.getValue().then((value) => {
      setSettings(value);
      setLoading(false);
    });
  }, []);

  const updateSettings = async (updates: Partial<FilterSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await filterSettings.setValue(newSettings);
  };

  if (loading) {
    return (
      <div className="w-72 p-2">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-72 p-2 space-y-4">
      <h1 className="text-base text-foreground">OpenScroll</h1>

      <div className="space-y-4">
        <FilterRow
          label="Recency"
          enabled={settings.enabled}
          onToggle={(enabled) => updateSettings({ enabled })}
        >
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              value={settings.threshold}
              onChange={(e) =>
                updateSettings({ threshold: parseInt(e.target.value) || 1 })
              }
              className="w-20"
            />
            <Select
              value={settings.unit}
              onValueChange={(unit: TimeUnit) => updateSettings({ unit })}
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
        </FilterRow>

        <FilterRow
          label="Minimum views"
          enabled={settings.minViewsEnabled}
          onToggle={(minViewsEnabled) => updateSettings({ minViewsEnabled })}
        >
          <Input
            type="number"
            min={0}
            value={settings.minViews}
            onChange={(e) =>
              updateSettings({ minViews: parseInt(e.target.value) || 0 })
            }
            className="w-full"
          />
        </FilterRow>

        <FilterRow
          label="Minimum comments"
          enabled={settings.minCommentsEnabled}
          onToggle={(minCommentsEnabled) => updateSettings({ minCommentsEnabled })}
        >
          <Input
            type="number"
            min={0}
            value={settings.minComments}
            onChange={(e) =>
              updateSettings({ minComments: parseInt(e.target.value) || 0 })
            }
            className="w-full"
          />
        </FilterRow>

        <FilterRow
          label="Minimum reposts"
          enabled={settings.minRepostsEnabled}
          onToggle={(minRepostsEnabled) => updateSettings({ minRepostsEnabled })}
        >
          <Input
            type="number"
            min={0}
            value={settings.minReposts}
            onChange={(e) =>
              updateSettings({ minReposts: parseInt(e.target.value) || 0 })
            }
            className="w-full"
          />
        </FilterRow>

        <FilterRow
          label="Minimum likes"
          enabled={settings.minLikesEnabled}
          onToggle={(minLikesEnabled) => updateSettings({ minLikesEnabled })}
        >
          <Input
            type="number"
            min={0}
            value={settings.minLikes}
            onChange={(e) =>
              updateSettings({ minLikes: parseInt(e.target.value) || 0 })
            }
            className="w-full"
          />
        </FilterRow>
      </div>

      <p className="text-xs text-muted-foreground">
        Filtered tweets are hidden from your timeline.
      </p>
    </div>
  );
}

export default App;
