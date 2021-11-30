import { SubClient } from './SubClient';

export class DashboardClient extends SubClient {
  constructor() {
    super('/proxy/data');
  }

  async getNatureScotlandIRDashboardData(aoi, options = {}) {
    const response = await this.makeAuthenticatedRequestJWT(
      '/astrosat/nature-scotland/search-api/dev/',
      {
        ...options,
        method: 'POST',
        body: JSON.stringify(aoi),
      },
    );

    return response.json();
  }
}
