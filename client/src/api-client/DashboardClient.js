import { SubClient } from './SubClient';

export class DashboardClient extends SubClient {
  constructor() {
    super('/proxy/data');
  }

  async getNatureScotlandIRDashboardData(url, aoi, options = {}) {
    const response = await this.makeAuthenticatedRequest(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(aoi),
    });
    return response.json();
  }

  /**
   * @returns {Promise<any>}
   * @throws {ResponseError}
   */
  async getDashboardData(url, options) {
    const response = await this.makeAuthenticatedRequest(url, options);
    return response.json();
  }
}
