import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'steps/**/*.ts',
  importTestFrom: 'steps/fixtures.ts'
});

export default defineConfig({
  testDir,
  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright']
  ],
  use: {
    trace: 'on-first-retry'
  }
});