import { setWorldConstructor, World } from '@cucumber/cucumber';
import { APIResponse } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';
import { UsersApi } from '../api/UsersApi';

export class ApiWorld extends World {
  apiClient!: ApiClient;
  usersApi!: UsersApi;

  response!: APIResponse;
  responseBody: any;
  payload: any;
  userId!: string;
}

setWorldConstructor(ApiWorld);