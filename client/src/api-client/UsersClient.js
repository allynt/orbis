import { SubClient } from './SubClient';

export class UsersClient extends SubClient {
  constructor() {
    super('/users');
  }

  /**
   * @param {import('typings').User['id']} userId
   * @returns {Promise<import('typings').User>}
   */
  async getUser(userId) {
    const response = await this.makeAuthenticatedRequest(`/${userId}`);
    return response.json();
  }

  async getCurrentUser() {
    return this.getUser('current');
  }

  /**
   * @param {import('typings').User} userWithUpdates
   * @returns {Promise<import('typings').User>}
   * @throws {import('./ResponseError').ResponseError}
   */
  async updateUser(userWithUpdates) {
    return this.makeAuthenticatedPutRequest(
      `/${userWithUpdates.id}/`,
      userWithUpdates,
    );
  }
}
