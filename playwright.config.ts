import { defineConfig, devices } from "@playwright/test";
export default defineConfig({ testDir: "./tests/e2e", fullyParallel: true, workers: process.env.CI ? 2 : 4, retries: process.env.CI ? 2 : 0,
reporter: [["list"], ["html", { open: "never" }]], use: { baseURL: "http://localhost:3000", trace: "retain-on-failure", channel: process.env.PLAYWRIGHT_CHANNEL },
projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
webServer: { command: "npm run start", url: "http://localhost:3000", reuseExistingServer: !process.env.CI, timeout: 120000 } });
