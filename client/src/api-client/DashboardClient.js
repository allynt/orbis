import { SubClient } from './SubClient';

export class DashboardClient extends SubClient {
  constructor() {
    super('/proxy/data');
  }

  async getNatureScotlandIRDashboardData(url, aoi, options = {}) {
    const response = await this.makeJWTAuthenticatedRequest(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(aoi),
    });

    return response.json();
  }
}
