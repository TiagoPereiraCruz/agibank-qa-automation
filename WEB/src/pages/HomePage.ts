import { Locator, Page } from '@playwright/test';

/**
 * HomePage
 *
 * Representa a página inicial do Blog do Agi e encapsula a interação
 * com a funcionalidade de pesquisa (lupa no cabeçalho).
 *
 * Obs.: o tema do blog é baseado em WordPress/Astra, então alguns seletores
 * têm fallback para diferentes variantes do tema.
 */
export class HomePage {
  readonly page: Page;

  // Elementos principais da busca
  readonly searchToggle: Locator; // botão/ícone que abre a caixa de busca
  readonly searchInput: Locator;  // campo de texto da busca
  readonly searchSubmit: Locator; // botão de enviar (quando existir)

  // Timeouts pequenos e fáceis de ajustar num único lugar
  private static readonly openToggleTimeoutMs = 2000;

  constructor(page: Page) {
    this.page = page;

    // Tenta localizar um botão/anchor que represente a ação de "Pesquisar"
    this.searchToggle = page
      .locator(
        [
          'button.ast-search-menu-icon',
          'button.ast-header-search',
          'button[aria-label*="Search" i]',
          'button[aria-label*="Pesquisar" i]',
          'a[aria-label*="Search" i]',
          'a[aria-label*="Pesquisar" i]',
          '.ast-search-icon'
        ].join(', ')
      )
      .first();

    // Preferimos um seletor semântico; fallback para name="s" (padrão WP)
    this.searchInput = page.locator('input[type="search"], input[name="s"]').first();

    // Botão de submit da busca (quando existir no DOM)
    this.searchSubmit = page.locator(
      'form[role="search"] button[type="submit"], form.search-form button[type="submit"], .ast-search-box__submit, button[type="submit"][aria-label*="Pesquisar" i]'
    ).first();
  }

  /**
   * Abre a home do blog (usa baseURL do Playwright config)
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Abre a caixa de busca se ela estiver oculta (tenta clicar na lupa do header).
   * Não lança erro se não conseguir — o fluxo de fallback cobre o cenário.
   */
  async openSearchIfHidden() {
    const isVisible = await this.searchInput.isVisible().catch(() => false);
    if (!isVisible) {
      const hasToggle = (await this.searchToggle.count()) > 0;
      if (hasToggle) {
        await this.searchToggle.click({ timeout: HomePage.openToggleTimeoutMs }).catch(() => undefined);
      }
    }
  }

  /**
   * Executa a pesquisa pelo termo informado. Primeiro tenta o caminho via UI;
   * se o campo não estiver visível (tema/variação de layout), faz fallback
   * navegando diretamente para a URL de busca (/?s=termo).
   */
  async searchFor(term: string) {
    // Tenta usar a UI da página (mais próximo do usuário real)
    await this.openSearchIfHidden();
    if (await this.searchInput.isVisible()) {
      await this.searchInput.fill('');
      await this.searchInput.type(term);
      if (await this.searchSubmit.isVisible()) {
        await Promise.all([
          this.page.waitForLoadState('domcontentloaded'),
          this.searchSubmit.click(),
        ]);
      } else {
        await Promise.all([
          this.page.waitForLoadState('domcontentloaded'),
          this.searchInput.press('Enter'),
        ]);
      }
      return;
    }

    // Fallback resiliente: navega direto para a página de resultados do WP
    const url = `/?s=${encodeURIComponent(term)}`;
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch {
      // Em raros casos o navegador pode abortar a navegação — tenta de novo.
      await this.page.waitForTimeout(400);
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }
  }
}
