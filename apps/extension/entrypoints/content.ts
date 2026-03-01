import {
  type CooldownSettings,
  cooldownSettings,
  type FilterSettings,
  filterSettings,
} from "@/lib/storage";
import {
  createTweetObserver,
  type FilterResult,
  filterTweets,
  resetCooldown,
  resetStats,
  startObserving,
  stopObserving,
} from "@/lib/tweet-filter";

export default defineContentScript({
  matches: ["*://x.com/*", "*://twitter.com/*"],
  main() {
    let currentSettings: FilterSettings | null = null;
    let currentCooldown: CooldownSettings | null = null;
    let observer: MutationObserver | null = null;
    let lastResult: FilterResult = {
      hiddenCount: 0,
      shownCount: 0,
      inCooldown: false,
      cooldownRemaining: 0,
    };

    function sendStats(result: FilterResult) {
      lastResult = result;
      browser.runtime.sendMessage({
        type: "UPDATE_STATS",
        ...result,
      });
    }

    async function applyFilter() {
      if (!currentSettings) {
        return;
      }

      const result = await filterTweets(
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

      sendStats(result);

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

      // Handle messages from popup and background
      browser.runtime.onMessage.addListener(
        (message, _sender, sendResponse) => {
          if (message.type === "LOCATION_CHANGE") {
            resetCooldown();
            resetStats().then(() => {
              setTimeout(applyFilter, 500);
            });
          } else if (message.type === "GET_STATS") {
            sendResponse(lastResult);
          }
          return true;
        }
      );
    }

    init();

    // Listen for WXT location change events (SPA navigation)
    window.addEventListener("wxt:locationchange", () => {
      resetCooldown();
      resetStats().then(() => {
        setTimeout(applyFilter, 500);
      });
    });
  },
});
