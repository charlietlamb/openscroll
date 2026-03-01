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
});
