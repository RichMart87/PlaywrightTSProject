import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://automationexercise.com';
const API_BASE_URL = process.env.API_BASE_URL ?? 'https://automationexercise.com';
const isCI = !!process.env.CI;

export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,
  reporter: isCI
    ? [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['github'],
      ]
    : [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  outputDir: 'test-results/artifacts',

  use: {
    baseURL: UI_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'smoke',
      testDir: './tests/ui/smoke',
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL },
    },
    {
      name: 'regression-chromium',
      testDir: './tests/ui/regression',
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL },
    },
    {
      name: 'regression-firefox',
      testDir: './tests/ui/regression',
      use: { ...devices['Desktop Firefox'], baseURL: UI_BASE_URL },
    },
    {
      name: 'regression-webkit',
      testDir: './tests/ui/regression',
      use: { ...devices['Desktop Safari'], baseURL: UI_BASE_URL },
    },
    {
      name: 'e2e',
      testDir: './tests/ui/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_BASE_URL },
    },
  ],
});
