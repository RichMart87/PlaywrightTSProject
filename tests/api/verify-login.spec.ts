import { test, expect } from '@fixtures/index';
import { uniqueEmail } from '@utils/testData';

test.describe('API: Verify Login', () => {
  test('API 7: POST /api/verifyLogin with valid credentials confirms the user exists @api', async ({
    apiClient,
    registeredUser,
  }) => {
    const response = await apiClient.verifyLogin(registeredUser.email, registeredUser.password);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User exists!');
  });

  test('API 8: POST /api/verifyLogin without email returns 400 @api', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', { form: { password: 'irrelevant' } });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
  });

  test('API 9: DELETE /api/verifyLogin is not a supported method @api', async ({ apiClient }) => {
    const response = await apiClient.deleteVerifyLogin();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });

  test('API 10: POST /api/verifyLogin with invalid credentials returns 404 @api', async ({ apiClient }) => {
    const response = await apiClient.verifyLogin(uniqueEmail('unregistered'), 'wrong-password');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe('User not found!');
  });
});
