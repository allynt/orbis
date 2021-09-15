import { SubClient } from './SubClient';

export class StorageClient extends SubClient {
  constructor() {
    super('/storage');
  }

  /**
   * @throws {ResponseError}
   */
  async getFiles() {
    const response = await this.makeAuthenticatedRequest('/');
    return response.json();
  }

  /**
   * @throws {ResponseError}
   */
  async deleteFile(fileId) {
    await this.makeAuthenticatedRequest(`/${fileId}/`, {
      method: 'DELETE',
    });
  }
}
