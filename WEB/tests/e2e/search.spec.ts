import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { SearchResultsPage } from '../../src/pages/SearchResultsPage';
import { dismissConsentIfPresent } from '../../src/utils/consent';

//
// Suite: Pesquisa no Blog do Agi
// O objetivo aqui é validar os comportamentos mais importantes do fluxo de busca
// (lupa no canto superior) para garantir que quem usa o blog consiga encontrar artigos.
//
test.describe('Blog do Agi - Pesquisa', () => {
  test('Pesquisa válida retorna resultados', async ({ page }) => {
    // Arrange: abrir a home e fechar possíveis banners de cookies
    const home = new HomePage(page);
    await home.goto();
    await dismissConsentIfPresent(page);
    // Act: pesquisar por um termo genérico que tende a retornar bastante conteúdo
    await home.searchFor('agi');

    const results = new SearchResultsPage(page);
    await results.expectUrlHasQuery('agi');
    await results.expectResults();
  });

  test('Pesquisa inválida exibe mensagem de nenhum resultado', async ({ page }) => {
    // Usamos um termo "quase impossível" de existir para garantir zero resultados
    const term = `zzqqlxx-${Date.now()}`;
    const home = new HomePage(page);
    await home.goto();
    await dismissConsentIfPresent(page);
    await home.searchFor(term);

    const results = new SearchResultsPage(page);
    await results.expectUrlHasQuery(term);
    await results.expectNoResults();
  });

  test('Abrir o primeiro resultado da pesquisa', async ({ page }) => {
    // Este teste garante que além de listar, conseguimos acessar um artigo da lista
    const home = new HomePage(page);
    await home.goto();
    await dismissConsentIfPresent(page);
    await home.searchFor('Agibank');

    const results = new SearchResultsPage(page);
    await results.expectResults();
    await results.openFirstResult();
    // Verifica se o artigo carregou
    await expect(page.locator('article')).toBeVisible();
  });
});
