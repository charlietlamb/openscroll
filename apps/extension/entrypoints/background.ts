const CONTENT_SCRIPT_ID = "openscroll-content";
const X_ORIGINS = ["*://x.com/*", "*://twitter.com/*"];

export default defineBackground(() => {
  // browser.action (MV3) vs browser.browserAction (MV2)
  const action = browser.action ?? browser.browserAction;

  function ensureContentScript(tabId?: number) {
    onPermissionsAvailable(tabId).catch(() => undefined);
  }

  async function getGrantedOrigins(): Promise<string[]> {
    const granted = await Promise.all(
      X_ORIGINS.map(async (origin) =>
        (await browser.permissions.contains({ origins: [origin] }))
          ? origin
          : null
      )
    );
    return granted.filter((origin) => origin !== null);
  }

  async function onPermissionsAvailable(tabId?: number) {
    const origins = await getGrantedOrigins();
    if (!origins.length) {
      return false;
    }

    const register = {
      id: CONTENT_SCRIPT_ID,
      matches: origins,
      js: ["/content-scripts/content.js"],
      runAt: "document_end" as const,
      persistAcrossSessions: true,
    };

    try {
      const existing = await browser.scripting.getRegisteredContentScripts({
        ids: [CONTENT_SCRIPT_ID],
      });
      const current = existing[0];
      const currentMatches = current?.matches ?? [];

      if (
        !current ||
        currentMatches.length !== register.matches.length ||
        currentMatches.some((match, index) => match !== register.matches[index])
      ) {
        await browser.scripting
          .unregisterContentScripts({ ids: [CONTENT_SCRIPT_ID] })
          .catch(() => undefined);
        await browser.scripting.registerContentScripts([register]);
      }
    } catch (err) {
      console.warn(
        "OpenScroll: failed to register dynamic content script",
        err
      );
    }

    if (tabId != null) {
      browser.scripting
        .executeScript({
          target: { tabId },
          files: ["/content-scripts/content.js"],
        })
        .catch(() => undefined);
      return true;
    }

    // Inject into any already-open X tabs
    try {
      const tabs = await browser.tabs.query({ url: origins });
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

    return true;
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.type === "UPDATE_STATS") {
      const count = message.hiddenCount as number;
      action.setBadgeText({ text: count > 0 ? String(count) : "" });
      action.setBadgeBackgroundColor({ color: "#1d9bf0" }); // X blue
    }
    if (message.type === "ENSURE_CONTENT_SCRIPT") {
      return onPermissionsAvailable(message.tabId);
    }
  });

  // On install/update, check if we already have host permissions (e.g. Chrome
  // auto-grants them). If so, register content scripts immediately.
  browser.runtime.onInstalled.addListener(() => {
    ensureContentScript();
  });

  // Listen for host permissions being granted at runtime (from the popup's
  // permissions.request() call on Arc). This fires after the user accepts
  // the standard Chrome permission dialog.
  browser.permissions.onAdded?.addListener((permissions) => {
    const hasOrigin = permissions.origins?.some(
      (o) => o.includes("x.com") || o.includes("twitter.com")
    );
    if (hasOrigin) {
      ensureContentScript();
    }
  });

  browser.runtime.onStartup?.addListener(() => {
    ensureContentScript();
  });

  ensureContentScript();
});
