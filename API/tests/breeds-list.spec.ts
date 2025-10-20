import { test, expect, request } from '@playwright/test';
import { expectSuccessResponse, expectValidBreedsObject, expectBreedsListSchema } from '../src/helpers/apiHelpers';

/**
 * Testes do endpoint GET /breeds/list/all
 * 
 * Este endpoint retorna todas as raças de cães disponíveis na API,
 * incluindo sub-raças quando existirem.
 */
test.describe('Dog CEO API - Lista de Raças', () => {
  
  test('Deve retornar todas as raças com status success', async ({ request }) => {
    const response = await request.get('/api/breeds/list/all');
    const body = await expectSuccessResponse(response);
    
    // Valida schema completo da resposta
    expectBreedsListSchema(body);
  });

  test('Deve retornar raças conhecidas no formato correto', async ({ request }) => {
    const response = await request.get('/api/breeds/list/all');
    const body = await response.json();
    
    // Valida schema completo da resposta
    expectBreedsListSchema(body);
    
    // Valida que raças comuns estão presentes
    expect(body.message).toHaveProperty('labrador');
    expect(body.message).toHaveProperty('bulldog');
    expect(body.message).toHaveProperty('beagle');
  });

  test('Deve retornar sub-raças quando existirem', async ({ request }) => {
    const response = await request.get('/api/breeds/list/all');
    const body = await response.json();
    
    // Bulldog tem sub-raças (boston, english, french)
    expect(Array.isArray(body.message.bulldog)).toBe(true);
    expect(body.message.bulldog.length).toBeGreaterThan(0);
    
    // Cada sub-raça deve ser uma string
    body.message.bulldog.forEach((subBreed: string) => {
      expect(typeof subBreed).toBe('string');
      expect(subBreed.length).toBeGreaterThan(0);
    });
  });

  test('Deve retornar array vazio para raças sem sub-raças', async ({ request }) => {
    const response = await request.get('/api/breeds/list/all');
    const body = await response.json();
    
    // Labrador não tem sub-raças
    expect(Array.isArray(body.message.labrador)).toBe(true);
    expect(body.message.labrador.length).toBe(0);
  });

  test('Deve retornar Content-Type application/json', async ({ request }) => {
    const response = await request.get('/api/breeds/list/all');
    expect(response.headers()['content-type']).toContain('application/json');
  });
});
