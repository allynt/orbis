import { SubClient } from './SubClient';

export class UsersClient extends SubClient {
  constructor() {
    super();
    this.endpoint = '/users';
  }

  /**
   * @param {User['id']} userId
   * @returns {Promise<User>}
   */
  async getUser(userId) {
    const response = await this.makeAuthenticatedRequest(`/${userId}`);
    return response.json();
  }

  async getCurrentUser() {
    return this.getUser('current');
  }

  /**
   * @param {User} userWithUpdates
   * @returns {Promise<User>}
   * @throws {import('./ResponseError').ResponseError}
   */
  async updateUser(userWithUpdates) {
    return this.makeAuthenticatedPutRequest(
      `/${userWithUpdates.id}/`,
      userWithUpdates,
    );
  }
}
