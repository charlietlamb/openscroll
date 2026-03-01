import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: "OpenScroll",
    description:
      "Filter your X timeline by tweet age and engagement. Hide old posts and low-engagement content to focus on what matters.",
    permissions: ["storage", "tabs"],
  },
  runner: {
    chromiumProfile: "./.wxt/chrome-data",
    keepProfileChanges: true,
    chromiumArgs: ["--disable-blink-features=AutomationControlled"],
    binaries: {
      firefox:
        "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox",
    },
  },
});
