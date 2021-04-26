import { SubClient } from './SubClient';

export class UsersClient extends SubClient {
  constructor() {
    super();
    this.endpoint = '/users';
  }

  /**
   * @param {User['email']} userId
   * @returns {Promise<User>}
   */
  async getUser(userId) {
    const response = await this.makeAuthenticatedRequest(`/${userId}`);
    return response.json();
  }

  async getCurrentUser() {
    return this.getUser('current');
  }
}
