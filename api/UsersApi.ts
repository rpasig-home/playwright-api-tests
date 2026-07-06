import { ApiClient } from './ApiClient';

export class UsersApi {
  constructor(private api: ApiClient) {}

  listUsers() {
    return this.api.get('users');
  }

  getUser(userId: string) {
    return this.api.get(`users/${userId}`);
  }

  createUser(payload: object) {
    return this.api.post('users', payload);
  }

  updateUser(userId: string, payload: object) {
    return this.api.put(`users/${userId}`, payload);
  }

  deleteUser(userId: string) {
    return this.api.delete(`users/${userId}`);
  }
}