import { SubClient } from './SubClient';

export class AoiClient extends SubClient {
  constructor() {
    super('/aois');
  }

  async getAois() {
    const response = await this.makeAuthenticatedRequest('/');
    return response.json();
  }

  async saveAoi({ geometry, ...rest }) {
    const formData = new FormData();
    Object.keys(rest).forEach(key => formData.set(key, rest[key]));
    formData.set('geometry', JSON.stringify(geometry));

    const response = await this.makeAuthenticatedRequest('/', {
      method: 'POST',
      headers: {
        Accept: 'application/json, application/xml, text/plain, text/html, *.*',
      },
      body: formData,
    });

    const result = response.json();

    return result;
  }

  async updateAoi(aoi) {
    const formData = new FormData();
    Object.keys(aoi).forEach(key => formData.set(key, aoi[key]));

    const response = await this.makeAuthenticatedRequest(`/${aoi.id}/`, {
      method: 'PUT',
      body: formData,
    });

    const result = response.json();

    return result;
  }

  async deleteAoi(aoiId) {
    await this.makeAuthenticatedRequest(`/${aoiId}/`, {
      method: 'DELETE',
    });
  }
}
