import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 180_000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3098', video: 'off', trace: 'off' },
  projects: [
    { name: 'chromium-mobile', use: { browserName: 'chromium', hasTouch: true, viewport: { width: 390, height: 844 } } },
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'chromium-small', use: { browserName: 'chromium', hasTouch: true, viewport: { width: 360, height: 740 } } },
    { name: 'webkit-mobile', use: { browserName: 'webkit', hasTouch: true, viewport: { width: 390, height: 844 } } },
    { name: 'webkit-desktop', use: { browserName: 'webkit', viewport: { width: 1440, height: 900 } } },
    { name: 'webkit-small', use: { browserName: 'webkit', hasTouch: true, viewport: { width: 360, height: 740 } } },
  ],
});
