import { filterSettings, type FilterSettings } from '@/lib/storage';
import {
  filterTweets,
  createTweetObserver,
  startObserving,
} from '@/lib/tweet-filter';

export default defineContentScript({
  matches: ['*://x.com/*', '*://twitter.com/*'],
  main() {
    let currentSettings: FilterSettings | null = null;
    let observer: MutationObserver | null = null;

    function updateBadge(count: number) {
      browser.runtime.sendMessage({ type: 'UPDATE_BADGE', count });
    }

    function applyFilter() {
      if (!currentSettings) return;
      const hiddenCount = filterTweets(currentSettings);
      updateBadge(hiddenCount);
    }

    async function init() {
      // Load initial settings
      currentSettings = await filterSettings.getValue();
      applyFilter();

      // Create observer for new tweets (infinite scroll)
      observer = createTweetObserver(applyFilter);
      startObserving(observer);

      // Watch for settings changes
      filterSettings.watch((newSettings) => {
        currentSettings = newSettings;
        applyFilter();
      });

      // Handle SPA navigation
      browser.runtime.onMessage.addListener((message) => {
        if (message.type === 'LOCATION_CHANGE') {
          // Reset badge on navigation
          updateBadge(0);
          // Re-filter after a short delay to allow new content to load
          setTimeout(applyFilter, 500);
        }
      });
    }

    init();

    // Listen for WXT location change events (SPA navigation)
    window.addEventListener('wxt:locationchange', () => {
      updateBadge(0);
      setTimeout(applyFilter, 500);
    });
  },
});
