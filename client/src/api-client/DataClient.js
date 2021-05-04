import { SubClient } from './SubClient';

export class DataClient extends SubClient {
  constructor() {
    super('/data');
  }

  /**
   * @returns {Promise<import('typings/orbis').Source[]>}
   */
  async getSources() {
    const response = await this.makeAuthenticatedRequest('/sources');
    return response.json();
  }
}
