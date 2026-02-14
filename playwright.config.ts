import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000, // Increased timeout to 60 seconds
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retry once on local
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    // GitHub Actions reporter untuk CI/CD integration
    process.env.CI ? ['github'] : ['list']
  ],
  use: {
    baseURL: 'https://www.saucedemo.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Auto headless di CI/CD environment
    headless: process.env.CI ? true : false,
    
    // Increased timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});