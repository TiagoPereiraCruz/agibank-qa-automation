import { expect } from '@playwright/test';

/**
 * Helpers para validação de respostas da Dog CEO API
 * 
 * Centraliza asserções comuns e validações de schema para evitar duplicação
 * nos testes e facilitar manutenção.
 */

/**
 * Valida que a resposta tem status 200 e estrutura básica da API Dog CEO
 */
export async function expectSuccessResponse(response: any) {
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('status', 'success');
  expect(body).toHaveProperty('message');
  return body;
}

/**
 * Valida que uma URL é válida e aponta para uma imagem
 */
export function expectValidImageUrl(url: string) {
  expect(url).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
}

/**
 * Valida que um array contém apenas URLs de imagens válidas
 */
export function expectValidImageUrls(urls: string[]) {
  expect(urls.length).toBeGreaterThan(0);
  urls.forEach(url => expectValidImageUrl(url));
}

/**
 * Valida estrutura do objeto de breeds (raças) retornado por /breeds/list/all
 */
export function expectValidBreedsObject(breeds: Record<string, string[]>) {
  expect(typeof breeds).toBe('object');
  expect(Object.keys(breeds).length).toBeGreaterThan(0);
  
  // Valida que cada raça tem nome válido e sub-raças (pode ser array vazio)
  Object.entries(breeds).forEach(([breedName, subBreeds]) => {
    expect(breedName).toBeTruthy();
    expect(typeof breedName).toBe('string');
    expect(Array.isArray(subBreeds)).toBe(true);
  });
}
