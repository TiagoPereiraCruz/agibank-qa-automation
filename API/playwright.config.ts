import { defineConfig } from '@playwright/test';

/**
 * Configuração do Playwright para testes de API
 * 
 * Usa o APIRequestContext do Playwright para fazer requisições HTTP
 * e validar respostas da Dog CEO API (https://dog.ceo/dog-api/).
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    // URL base da Dog CEO API (sem /api no final, pois os endpoints já incluem)
    baseURL: 'https://dog.ceo',
    // Headers padrão para todas as requisições
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    // Captura trace (linha do tempo de requisições) sempre
    trace: 'on',
  },
});
