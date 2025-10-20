import { test, expect } from '@playwright/test';
import { expectSuccessResponse, expectValidImageUrl } from '../src/helpers/apiHelpers';

/**
 * Testes do endpoint GET /breeds/image/random
 * 
 * Este endpoint retorna uma imagem aleatória de qualquer raça.
 * Também suporta parâmetro ?count=N para retornar múltiplas imagens.
 */
test.describe('Dog CEO API - Imagem Aleatória', () => {
  
  test('Deve retornar uma imagem aleatória com status success', async ({ request }) => {
    const response = await request.get('/api/breeds/image/random');
    const body = await expectSuccessResponse(response);
    
    // Message deve ser uma string (URL da imagem)
    expect(typeof body.message).toBe('string');
    expectValidImageUrl(body.message);
  });

  test('Deve retornar URLs diferentes em requisições consecutivas', async ({ request }) => {
    const response1 = await request.get('/api/breeds/image/random');
    const body1 = await response1.json();
    
    const response2 = await request.get('/api/breeds/image/random');
    const body2 = await response2.json();
    
    const response3 = await request.get('/api/breeds/image/random');
    const body3 = await response3.json();
    
    // Pelo menos uma das 3 deve ser diferente (API é aleatória)
    const urls = [body1.message, body2.message, body3.message];
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBeGreaterThan(1);
  });

  test('Deve retornar múltiplas imagens com parâmetro count', async ({ request }) => {
    const count = 5;
    const response = await request.get(`/api/breeds/image/random/${count}`);
    const body = await expectSuccessResponse(response);
    
    // Message deve ser um array com o número solicitado de URLs
    expect(Array.isArray(body.message)).toBe(true);
    expect(body.message.length).toBe(count);
    
    body.message.forEach((url: string) => {
      expectValidImageUrl(url);
    });
  });

  test('A URL retornada deve estar acessível', async ({ request }) => {
    const response = await request.get('/api/breeds/image/random');
    const body = await response.json();
    
    // Faz uma requisição para a imagem retornada
    const imageUrl = body.message;
    const imgResponse = await request.get(imageUrl);
    
    expect(imgResponse.status()).toBe(200);
    expect(imgResponse.headers()['content-type']).toMatch(/image\/(jpeg|jpg|png|gif)/);
  });

  test('Deve retornar imagens de raças diferentes ao longo do tempo', async ({ request }) => {
    const breeds = new Set<string>();
    
    // Faz 10 requisições e extrai a raça de cada URL
    for (let i = 0; i < 10; i++) {
      const response = await request.get('/api/breeds/image/random');
      const body = await response.json();
      
      // URL format: https://images.dog.ceo/breeds/{breed}-{subbreed}/...
      // ou https://images.dog.ceo/breeds/{breed}/...
      const match = body.message.match(/breeds\/([^\/]+)/);
      if (match) {
        breeds.add(match[1]);
      }
    }
    
    // Deve ter retornado imagens de pelo menos 2 raças diferentes
    expect(breeds.size).toBeGreaterThan(1);
  });

  test('Deve retornar Content-Type application/json', async ({ request }) => {
    const response = await request.get('/api/breeds/image/random');
    expect(response.headers()['content-type']).toContain('application/json');
  });
});
