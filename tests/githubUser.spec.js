import { test, expect } from '@playwright/test';
import { createApiContext } from '../utils/apiClient';
import logger from '../utils/logger.js';
import { createAllureLogger } from '../utils/allureLogger.js';

createAllureLogger();

test('TC-01- Verify that user is able to get authenticated user details with valid credentials', async () => {
  const api = await createApiContext();

  const response = await api.get('/user');
  const body = await response.json();

  expect(response.status()).toBe(200);
  logger.info(`Authenticated user: ${body.login} (ID: ${body.id})`);
  expect(body).toHaveProperty('login');
  expect(body).toHaveProperty('id');
});


test('TC-02- Verify that user is not able to access gitHub api when token is invalid', async ({ request }) => {
  const response = await request.get(
    'https://api.github.com/user',
    {
      headers: { Authorization: 'Bearer invalid_token' },
    }
  );

  expect(response.status()).toBe(401);
  logger.info('Received error:' + (await response.text()));
});