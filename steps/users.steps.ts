import { createBdd } from 'playwright-bdd';
import { expect, test } from './fixtures';
import Ajv from 'ajv';
import { APIResponse } from '@playwright/test';
import userSchema from '../schemas/user.schema.json';

const { Given, When, Then } = createBdd(test);
const ajv = new Ajv();

async function parseResponseBody(response: APIResponse) {
  const contentType = response.headers()['content-type'] || '';

  if (!contentType.includes('application/json')) {
    return undefined;
  }

  return await response.json();
}

When('I request the list of users', async ({ usersApi, $testInfo }) => {
  const response = await usersApi.listUsers();
  const responseBody = await parseResponseBody(response);

  $testInfo.attach('response-body', {
    body: JSON.stringify(responseBody, null, 2),
    contentType: 'application/json'
  });

  $testInfo['response'] = response;
  $testInfo['responseBody'] = responseBody;
});

When('I request user with id {string}', async ({ usersApi, $testInfo }, userId: string) => {
  const response = await usersApi.getUser(userId);
  const responseBody = await parseResponseBody(response);

  $testInfo.attach('response-body', {
    body: JSON.stringify(responseBody, null, 2),
    contentType: 'application/json'
  });

  $testInfo['response'] = response;
  $testInfo['responseBody'] = responseBody;
});

Given('I have a valid user payload', async ({$testInfo}) => {
  $testInfo['payload'] = {
    name: 'Riche',
    job: 'SDET'
  };
});

When('I send a request to create the user', async ({ usersApi, $testInfo }) => {
  const payload = $testInfo['payload'];

  const response = await usersApi.createUser(payload);
  const responseBody = await parseResponseBody(response);

  $testInfo['response'] = response;
  $testInfo['responseBody'] = responseBody;
});

Given('I have an updated user payload', async ({$testInfo}) => {
  $testInfo['payload'] = {
    name: 'Riche Updated',
    job: 'Senior SDET'
  };
});

When('I send a request to update user with id {string}', async ({ usersApi, $testInfo }, userId: string) => {
  const payload = $testInfo['payload'];

  const response = await usersApi.updateUser(userId, payload);
  const responseBody = await parseResponseBody(response);

  $testInfo['response'] = response;
  $testInfo['responseBody'] = responseBody;
});

When('I send a request to delete user with id {string}', async ({ usersApi, $testInfo }, userId: string) => {
  const response = await usersApi.deleteUser(userId);

  $testInfo['response'] = response;
});

Then('the response status should be {int}', async ({ $testInfo}, statusCode: number) => {
  const response = $testInfo['response'] as APIResponse;
  expect(response.status()).toBe(statusCode);
});

Then('the response should contain users', async ({$testInfo}) => {
  const responseBody = $testInfo['responseBody'];

  expect(Array.isArray(responseBody)).toBeTruthy();
  expect(responseBody.length).toBeGreaterThan(0);
});

Then('the user response should match the user schema', async ({$testInfo}) => {
  const responseBody = $testInfo['responseBody'];

  const validate = ajv.compile(userSchema);
  const isValid = validate(responseBody);

  expect(isValid, JSON.stringify(validate.errors, null, 2)).toBeTruthy();
});

Then('the response should contain the created user details', async ({$testInfo}) => {
  const responseBody = $testInfo['responseBody'];
  const payload = $testInfo['payload'];

  expect(responseBody.name).toBe(payload.name);
  expect(responseBody.job).toBe(payload.job);
  expect(responseBody.id).toBeTruthy();
});

Then('the response should contain the updated user details', async ({$testInfo}) => {
  const responseBody = $testInfo['responseBody'];
  const payload = $testInfo['payload'];

  expect(responseBody.name).toBe(payload.name);
  expect(responseBody.job).toBe(payload.job);
  expect(responseBody.id).toBeTruthy();
});