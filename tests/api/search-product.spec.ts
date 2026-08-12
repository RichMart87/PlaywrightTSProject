import { test, expect } from '@fixtures/index';

test.describe('API: Search Product', () => {
  test('API 5: POST /api/searchProduct returns matching products @api', async ({ apiClient }) => {
    const response = await apiClient.searchProduct('top');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('API 6: POST /api/searchProduct without search_product returns 400 @api', async ({ request }) => {
    const response = await request.post('/api/searchProduct');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });
});
