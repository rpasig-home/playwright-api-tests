import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['html'], ['list']],
  use: {
    trace: 'on-first-retry'
  }
});