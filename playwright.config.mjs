// Dev only. Runs tools/replay.spec.mjs in two browser engines.
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tools", testMatch: /\.spec\.mjs$/, timeout: 120000, reporter: "list",
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }]
});
