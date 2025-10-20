import { Locator, Page, expect } from '@playwright/test';

/**
 * SearchResultsPage
 *
 * Modela a página de resultados de busca do Blog do Agi (WordPress).
 * Foca em verificações estruturais (ex.: existência de articles) em vez de
 * textos específicos que podem mudar conforme o tema.
 */
export class SearchResultsPage {
  readonly page: Page;

  // Principais elementos usados nos asserts
  readonly resultsHeading: Locator; // título "Resultados..." (quando presente)
  readonly resultCards: Locator;    // lista de artigos retornados
  readonly noResults: Locator;      // contêiner padrão de "sem resultados"

  constructor(page: Page) {
    this.page = page;
    this.resultsHeading = page.locator('h1, h2').filter({ hasText: /Resultados encontrados para|resultados/i });
    this.resultCards = page.locator('#content article, main article, .site-main article');
    this.noResults = page.locator('.no-results, .search-no-results');
  }

  /**
   * Confirma que a URL contém o parâmetro s= com o termo pesquisado.
   */
  async expectUrlHasQuery(term: string) {
    await expect(this.page).toHaveURL(new RegExp(`[?&]s=.*${encodeURIComponent(term)}`, 'i'));
  }

  /**
   * Verifica que há pelo menos um artigo nos resultados.
   */
  async expectResults() {
    // Se o heading não existir, a presença de articles já é suficiente.
    await expect(this.resultCards.first()).toBeVisible();
  }

  /**
   * Verifica cenário "sem resultados": zero artigos na listagem principal.
   * Faz também uma checagem branda de mensagem clássica do WordPress.
   */
  async expectNoResults() {
    await expect(this.resultCards).toHaveCount(0, { timeout: 10_000 });
    const msg = this.page.getByText(/(não foram encontrados resultados|nenhum resultado|nada foi encontrado|desculpe, mas nada)/i);
    await expect.soft(msg).toBeVisible({ timeout: 3000 });
  }

  /**
   * Abre o primeiro artigo encontrado na busca e valida o carregamento da página.
   */
  async openFirstResult() {
    const firstLink = this.page.locator('article a').first();
    await firstLink.click();
    await expect(this.page).toHaveURL(/https:\/\/blog\.agibank\.com\.br\//);
    await expect(this.page.locator('article')).toBeVisible();
  }
}
