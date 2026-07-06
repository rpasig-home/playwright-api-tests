import { Before, After } from '@cucumber/cucumber';
import { ApiWorld } from './world';
import { ApiClient } from '../api/ApiClient';
import { UsersApi } from '../api/UsersApi';

Before(async function (this: ApiWorld) {
  this.apiClient = new ApiClient();
  await this.apiClient.init();

  this.usersApi = new UsersApi(this.apiClient);
});

After(async function (this: ApiWorld) {
  await this.apiClient.dispose();
});