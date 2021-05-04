import { SubClient } from './SubClient';

export class AppClient extends SubClient {
  constructor() {
    super('/app');
  }

  /**
   * @returns {Promise<any>}
   */
  async getConfig() {
    const response = await this.makeRequest('/config');
    return response.json();
  }
}
