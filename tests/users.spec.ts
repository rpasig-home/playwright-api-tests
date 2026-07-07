import { test, expect, APIResponse } from '@playwright/test';
import Ajv from 'ajv';
import { ApiClient } from '../api/ApiClient';
import { UsersApi } from '../api/UsersApi';
import userSchema from '../schemas/user.schema.json';

const ajv = new Ajv();

async function parseResponseBody(response: APIResponse) {
  const contentType = response.headers()['content-type'] || '';

  if (!contentType.includes('application/json')) {
    return undefined;
  }

  return await response.json();
}

test.describe('JSONPlaceholder Users API', () => {
  let apiClient: ApiClient;
  let usersApi: UsersApi;

  test.beforeEach(async () => {
    apiClient = new ApiClient();
    await apiClient.init();
    usersApi = new UsersApi(apiClient);
  });

  test.afterEach(async () => {
    await apiClient.dispose();
  });

  test('List users successfully @smoke', async () => {
    const response = await usersApi.listUsers();
    const body = await parseResponseBody(response);

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('Get a single user successfully @smoke', async () => {
    const response = await usersApi.getUser('2');
    const body = await parseResponseBody(response);

    expect(response.status()).toBe(200);

    const validate = ajv.compile(userSchema);
    const isValid = validate(body);

    expect(isValid, JSON.stringify(validate.errors, null, 2)).toBeTruthy();
  });

  test('Create a user successfully', async () => {
    const payload = {
      name: 'Riche',
      job: 'SDET'
    };

    const response = await usersApi.createUser(payload);
    const body = await parseResponseBody(response);

    expect(response.status()).toBe(201);
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.id).toBeTruthy();
  });

  test('Update a user successfully', async () => {
    const payload = {
      name: 'Riche Updated',
      job: 'Senior SDET'
    };

    const response = await usersApi.updateUser('2', payload);
    const body = await parseResponseBody(response);

    expect(response.status()).toBe(200);
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.id).toBeTruthy();
  });

  test('Delete a user successfully', async () => {
    const response = await usersApi.deleteUser('2');

    expect(response.status()).toBe(200);
  });

  test('User is not found', async () => {
    const response = await usersApi.getUser('999');

    expect(response.status()).toBe(404);
  });
});