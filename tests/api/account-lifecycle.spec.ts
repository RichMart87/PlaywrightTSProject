import { test, expect } from '@fixtures/index';
import { generateUser } from '@utils/testData';

test.describe('API: Account Lifecycle', () => {
  test('API 11: POST /api/createAccount creates a new user @api', async ({ apiClient }) => {
    const user = generateUser();

    const response = await apiClient.createAccount(user);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(201);
    expect(body.message).toBe('User created!');

    await apiClient.deleteAccount(user.email, user.password);
  });

  test('API 12: DELETE /api/deleteAccount removes an existing user @api', async ({ apiClient }) => {
    const user = generateUser();
    const createResponse = await apiClient.createAccount(user);
    expect((await createResponse.json()).responseCode).toBe(201);

    const response = await apiClient.deleteAccount(user.email, user.password);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('Account deleted!');

    const verifyResponse = await apiClient.verifyLogin(user.email, user.password);
    expect((await verifyResponse.json()).responseCode).toBe(404);
  });

  test('API 13: PUT /api/updateAccount updates an existing user @api', async ({ apiClient }) => {
    const user = generateUser();
    const createResponse = await apiClient.createAccount(user);
    expect((await createResponse.json()).responseCode).toBe(201);

    const updatedUser = { ...user, firstName: 'Updated', lastName: 'Name', company: 'Updated Co' };
    const response = await apiClient.updateAccount(updatedUser);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User updated!');

    const detailResponse = await apiClient.getUserDetailByEmail(user.email);
    const detailBody = await detailResponse.json();
    expect(detailBody.user.first_name).toBe('Updated');
    expect(detailBody.user.last_name).toBe('Name');

    await apiClient.deleteAccount(user.email, user.password);
  });

  test('API 14: GET /api/getUserDetailByEmail returns the account details @api', async ({ apiClient }) => {
    const user = generateUser();
    const createResponse = await apiClient.createAccount(user);
    expect((await createResponse.json()).responseCode).toBe(201);

    const response = await apiClient.getUserDetailByEmail(user.email);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.user.email).toBe(user.email);
    expect(body.user.first_name).toBe(user.firstName);

    await apiClient.deleteAccount(user.email, user.password);
  });
});
