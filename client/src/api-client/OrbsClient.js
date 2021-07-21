import { SubClient } from './SubClient';

export class OrbsClient extends SubClient {
  constructor() {
    super('/orbs');
  }

  /** @returns {Promise<import('typings/orbis').Orb[]>} */
  async getOrbs() {
    return (await this.makeAuthenticatedRequest('/')).json();
  }
}
