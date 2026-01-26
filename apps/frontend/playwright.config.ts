import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @car-dealership/backend dev',
      url: 'http://localhost:3000/health',
      reuseExistingServer: !process.env.CI,
      cwd: '../..',
      timeout: 120 * 1000,
    },
    {
      command: 'pnpm --filter @car-dealership/frontend dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      cwd: '../..',
      timeout: 120 * 1000,
    },
  ],
});
