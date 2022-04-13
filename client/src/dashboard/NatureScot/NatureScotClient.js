import { SubClient } from 'api-client/SubClient';

export class NatureScotClient extends SubClient {
  constructor() {
    super('/proxy/data');
  }

  async getImpactData(url, options = {}) {
    const response = await this.makeAuthenticatedRequest(url, {
      ...options,
      method: 'POST',
    });
    return response.json();
  }
}
