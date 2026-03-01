import {
  type CooldownSettings,
  cooldownSettings,
  type FilterSettings,
  filterSettings,
} from "@/lib/storage";
import {
  createTweetObserver,
  filterTweets,
  resetCooldown,
  startObserving,
  stopObserving,
} from "@/lib/tweet-filter";

export default defineContentScript({
  matches: ["*://x.com/*", "*://twitter.com/*"],
  main() {
    let currentSettings: FilterSettings | null = null;
    let currentCooldown: CooldownSettings | null = null;
    let observer: MutationObserver | null = null;

    function updateBadge(count: number, inCooldown = false) {
      browser.runtime.sendMessage({
        type: "UPDATE_BADGE",
        count,
        inCooldown,
      });
    }

    function applyFilter() {
      if (!currentSettings) {
        return;
      }

      const result = filterTweets(
        currentSettings,
        currentCooldown ?? undefined,
        () => {
          // Cooldown ended - resume observing and re-filter
          if (observer) {
            startObserving(observer);
          }
          applyFilter();
        }
      );

      updateBadge(result.hiddenCount, result.inCooldown);

      // Pause observer during cooldown to prevent scroll loading
      if (result.inCooldown && observer) {
        stopObserving(observer);
      }
    }

    async function init() {
      // Load initial settings
      [currentSettings, currentCooldown] = await Promise.all([
        filterSettings.getValue(),
        cooldownSettings.getValue(),
      ]);
      applyFilter();

      // Create observer for new tweets (infinite scroll)
      observer = createTweetObserver(applyFilter);
      startObserving(observer);

      // Watch for settings changes
      filterSettings.watch((newSettings) => {
        currentSettings = newSettings;
        applyFilter();
      });

      cooldownSettings.watch((newCooldown) => {
        currentCooldown = newCooldown;
      });

      // Handle SPA navigation
      browser.runtime.onMessage.addListener((message) => {
        if (message.type === "LOCATION_CHANGE") {
          resetCooldown();
          updateBadge(0);
          setTimeout(applyFilter, 500);
        }
      });
    }

    init();

    // Listen for WXT location change events (SPA navigation)
    window.addEventListener("wxt:locationchange", () => {
      resetCooldown();
      updateBadge(0);
      setTimeout(applyFilter, 500);
    });
  },
});
