import { SubClient } from 'api-client/SubClient';

export class NatureScotClient extends SubClient {
  constructor() {
    super('/proxy/data');
  }

  async getImpactData(url, form, options = {}) {
    const response = await this.makeAuthenticatedRequest(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(form),
    });
    return response.json();
  }
}
