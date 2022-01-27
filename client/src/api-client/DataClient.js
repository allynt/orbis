import { SubClient } from './SubClient';

export class DataClient extends SubClient {
  constructor() {
    super('/data');
  }

  /**
   * @returns {Promise<{
   *  sources: import('typings').Source[]
   *  token: string
   *  timeout: number
   * }>}
   */
  async getSources() {
    const response = await this.makeAuthenticatedRequest('/sources/');
    return response.json();
  }
}
