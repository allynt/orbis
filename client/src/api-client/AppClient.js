import { SubClient } from './SubClient';

export class AppClient extends SubClient {
  constructor() {
    super();
    this.endpoint = '/app';
  }

  /**
   * @returns {Promise<any>}
   */
  async getConfig() {
    const response = await this.makeRequest(`${this.endpoint}/config`);
    return response.json();
  }
}
