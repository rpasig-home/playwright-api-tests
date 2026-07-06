import { Given, When, Then } from '@cucumber/cucumber';
import { expect, APIResponse } from '@playwright/test';
import Ajv from 'ajv';
import { ApiWorld } from '../support/world';
import userSchema from '../schemas/user.schema.json';

const ajv = new Ajv();

async function parseResponseBody(response: APIResponse) {
  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    return undefined;
  }

  return await response.json();
}

When('I request the list of users', async function (this: ApiWorld) {
  this.response = await this.usersApi.listUsers();
  this.responseBody = await parseResponseBody(this.response);
});

When('I request user with id {string}', async function (this: ApiWorld, userId: string) {
  this.response = await this.usersApi.getUser(userId);
  this.responseBody = await parseResponseBody(this.response);
});

Given('I have a valid user payload', function (this: ApiWorld) {
  this.payload = {
    name: 'Riche',
    job: 'SDET'
  };
});

When('I send a request to create the user', async function (this: ApiWorld) {
  this.response = await this.usersApi.createUser(this.payload);
  this.responseBody = await parseResponseBody(this.response);
});

Given('I have an updated user payload', function (this: ApiWorld) {
  this.payload = {
    name: 'Riche Updated',
    job: 'Senior SDET'
  };
});

When('I send a request to update user with id {string}', async function (this: ApiWorld, userId: string) {
  this.response = await this.usersApi.updateUser(userId, this.payload);
  this.responseBody = await parseResponseBody(this.response);
});

When('I send a request to delete user with id {string}', async function (this: ApiWorld, userId: string) {
  this.response = await this.usersApi.deleteUser(userId);
});

Then('the response status should be {int}', async function (this: ApiWorld, statusCode: number) {
  const actualStatus = this.response.status();
  let bodyText = '';

  try {
    if (this.responseBody !== undefined) {
      bodyText = JSON.stringify(this.responseBody);
    } else {
      bodyText = await this.response.text();
    }
  } catch (error) {
    bodyText = `Unable to read response body: ${String(error)}`;
  }

  expect(actualStatus, `Expected HTTP ${statusCode} but got ${actualStatus}. Response body: ${bodyText}`).toBe(statusCode);
});

Then('the response should contain users', function (this: ApiWorld) {
  expect(Array.isArray(this.responseBody)).toBeTruthy();
  expect(this.responseBody.length).toBeGreaterThan(0);
});

Then('the user response should match the user schema', function (this: ApiWorld) {
  const validate = ajv.compile(userSchema);
  const isValid = validate(this.responseBody);

  expect(isValid, JSON.stringify(validate.errors, null, 2)).toBeTruthy();
});

Then('the response should contain the created user details', function (this: ApiWorld) {
  expect(this.responseBody.name).toBe(this.payload.name);
  expect(this.responseBody.job).toBe(this.payload.job);
  expect(this.responseBody.id).toBeTruthy();
});

Then('the response should contain the updated user details', function (this: ApiWorld) {
  expect(this.responseBody.name).toBe(this.payload.name);
  expect(this.responseBody.job).toBe(this.payload.job);
  expect(this.responseBody.id).toBeTruthy();
});