import { test, expect } from '@fixtures/index';

test.describe('API: Products and Brands', () => {
  test('API 1: GET /api/productsList returns the full product list @api', async ({ apiClient }) => {
    const response = await apiClient.getProductsList();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);

    const product = body.products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('brand');
    expect(product).toHaveProperty('category');
  });

  test('API 2: POST /api/productsList is not a supported method @api', async ({ apiClient }) => {
    const response = await apiClient.postProductsList();
    // AutomationExercise always replies with HTTP 200 and encodes the real status in the body.
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });

  test('API 3: GET /api/brandsList returns the full brand list @api', async ({ apiClient }) => {
    const response = await apiClient.getBrandsList();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.brands)).toBe(true);
    expect(body.brands.length).toBeGreaterThan(0);
    expect(body.brands[0]).toHaveProperty('id');
    expect(body.brands[0]).toHaveProperty('brand');
  });

  test('API 4: PUT /api/brandsList is not a supported method @api', async ({ apiClient }) => {
    const response = await apiClient.putBrandsList();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });
});
