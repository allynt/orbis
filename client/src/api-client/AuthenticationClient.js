import { SubClient } from './SubClient';

export class AuthenticationClient extends SubClient {
  constructor() {
    super();
    this.endpoint = '/authentication';
  }

  /**
   * @param {{
   *  email: User['email']
   *  password: string
   *  accepted_terms: User['accepted_terms']
   * }} loginParams
   * @returns {Promise<{user: PartialUser, token: string}>}
   */
  async login(loginParams) {
    const response = await this.makeRequest('/login/', {
      method: 'POST',
      body: JSON.stringify(loginParams),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  async logout() {
    await this.makeAuthenticatedRequest('/logout/', { method: 'POST' });
  }
}
