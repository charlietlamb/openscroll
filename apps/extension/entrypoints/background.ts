const CONTENT_SCRIPT_ID = "openscroll-content";
const X_ORIGINS = ["*://x.com/*", "*://twitter.com/*"];

export default defineBackground(() => {
  // browser.action (MV3) vs browser.browserAction (MV2)
  const action = browser.action ?? browser.browserAction;

  browser.runtime.onMessage.addListener((message) => {
    if (message.type === "UPDATE_STATS") {
      const count = message.hiddenCount as number;
      action.setBadgeText({ text: count > 0 ? String(count) : "" });
      action.setBadgeBackgroundColor({ color: "#1d9bf0" }); // X blue
    }
  });

  // When host permissions are granted (either at install on Chrome, or via
  // runtime permissions.request() on Arc), register the content script
  // dynamically and inject into any already-open X tabs.
  async function onPermissionsAvailable() {
    try {
      await browser.scripting
        .unregisterContentScripts({ ids: [CONTENT_SCRIPT_ID] })
        .catch(() => undefined);

      await browser.scripting.registerContentScripts([
        {
          id: CONTENT_SCRIPT_ID,
          matches: X_ORIGINS,
          js: ["/content-scripts/content.js"],
          runAt: "document_end",
          persistAcrossSessions: true,
        },
      ]);
    } catch (err) {
      console.warn(
        "OpenScroll: failed to register dynamic content script",
        err
      );
    }

    // Inject into any already-open X tabs
    try {
      const tabs = await browser.tabs.query({ url: X_ORIGINS });
      for (const tab of tabs) {
        if (tab.id == null) {
          continue;
        }
        browser.scripting
          .executeScript({
            target: { tabId: tab.id },
            files: ["/content-scripts/content.js"],
          })
          .catch(() => undefined);
      }
    } catch {
      // tabs.query may fail if permissions aren't granted yet
    }
  }

  // On install/update, check if we already have host permissions (e.g. Chrome
  // auto-grants them). If so, register content scripts immediately.
  browser.runtime.onInstalled.addListener(async () => {
    const granted = await browser.permissions.contains({
      origins: X_ORIGINS,
    });
    if (granted) {
      onPermissionsAvailable();
    }
  });

  // Listen for host permissions being granted at runtime (from the popup's
  // permissions.request() call on Arc). This fires after the user accepts
  // the standard Chrome permission dialog.
  browser.permissions.onAdded?.addListener((permissions) => {
    const hasOrigin = permissions.origins?.some(
      (o) => o.includes("x.com") || o.includes("twitter.com")
    );
    if (hasOrigin) {
      onPermissionsAvailable();
    }
  });
});
