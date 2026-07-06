import { request, APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../config/env';

export class ApiClient {
  private context!: APIRequestContext;

  async init(): Promise<void> {
    if (!env.baseUrl) {
      throw new Error('BASE_URL must be configured before running API tests.');
    }

    this.context = await request.newContext({
      baseURL: env.baseUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        ...(env.apiToken ? { Authorization: `Bearer ${env.apiToken}` } : {})
      }
    });
  }

  async get(path: string): Promise<APIResponse> {
    return this.context.get(path);
  }

  async post(path: string, body: object): Promise<APIResponse> {
    return this.context.post(path, { data: body });
  }

  async put(path: string, body: object): Promise<APIResponse> {
    return this.context.put(path, { data: body });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.context.delete(path);
  }

  async dispose(): Promise<void> {
    await this.context.dispose();
  }
}