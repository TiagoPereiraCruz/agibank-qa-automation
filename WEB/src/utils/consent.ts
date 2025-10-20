import { Page } from '@playwright/test';

export async function dismissConsentIfPresent(page: Page) {
  const selectors = [
    'button#onetrust-accept-btn-handler',
    'button[aria-label*="Aceitar" i]',
    'button:has-text("Aceitar"), button:has-text("Accept")',
    '.cc-allow',
  ];
  for (const sel of selectors) {
    const btn = page.locator(sel);
    if (await btn.first().isVisible().catch(() => false)) {
      await btn.first().click({ timeout: 1000 }).catch(() => {});
      break;
    }
  }
}
