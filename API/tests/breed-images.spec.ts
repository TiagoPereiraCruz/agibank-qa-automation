import { test, expect } from '@playwright/test';
import { expectSuccessResponse, expectValidImageUrls, expectBreedImagesSchema } from '../src/helpers/apiHelpers';

/**
 * Testes do endpoint GET /breed/{breed}/images
 * 
 * Este endpoint retorna todas as imagens disponíveis de uma raça específica.
 * Suporta sub-raças no formato /breed/{breed}/{sub-breed}/images
 */
test.describe('Dog CEO API - Imagens por Raça', () => {
  
  test('Deve retornar imagens para raça válida (beagle)', async ({ request }) => {
    const response = await request.get('/api/breed/beagle/images');
    const body = await expectSuccessResponse(response);
    
    // Valida schema completo da resposta
    expectBreedImagesSchema(body);
  });

  test('Deve retornar imagens para sub-raça (bulldog/french)', async ({ request }) => {
    const response = await request.get('/api/breed/bulldog/french/images');
    const body = await expectSuccessResponse(response);
    
    // Valida schema completo da resposta
    expectBreedImagesSchema(body);
    
    // URLs devem conter a raça e sub-raça no caminho
    body.message.forEach((url: string) => {
      expect(url).toContain('bulldog');
      expect(url).toContain('french');
    });
  });

  test('Deve retornar erro 404 para raça inexistente', async ({ request }) => {
    const response = await request.get('/api/breed/racainexistente123/images');
    
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toContain('Breed not found');
  });

  test('Deve retornar erro 404 para sub-raça inexistente', async ({ request }) => {
    const response = await request.get('/api/breed/beagle/subraca-fake/images');
    
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.status).toBe('error');
  });

  test('Todas as URLs retornadas devem estar acessíveis', async ({ request }) => {
    const response = await request.get('/api/breed/pug/images');
    const body = await response.json();
    
    // Testa as primeiras 3 URLs para não demorar muito
    const urlsToTest = body.message.slice(0, 3);
    
    for (const imageUrl of urlsToTest) {
      const imgResponse = await request.get(imageUrl);
      expect(imgResponse.status()).toBe(200);
      expect(imgResponse.headers()['content-type']).toMatch(/image\/(jpeg|jpg|png|gif)/);
    }
  });

  test('Deve retornar Content-Type application/json', async ({ request }) => {
    const response = await request.get('/api/breed/husky/images');
    expect(response.headers()['content-type']).toContain('application/json');
  });
});
