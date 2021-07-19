import { SubClient } from './SubClient';

export class SatellitesClient extends SubClient {
  constructor() {
    super('/satellites');
  }

  /** @returns {Promise<import('typings/satellites').Satellite[]>} */
  async getSatellites() {
    return (await this.makeAuthenticatedRequest('/')).json();
  }

  /**
   * @param {{
   *  satellites: import('typings/satellites').Satellite['id'][]
   *  start_date: string
   *  end_date: string
   * }} search
   * @returns {Promise<import('typings/satellites').Scene[]>}
   */
  async runQuery(search) {
    return this.makeAuthenticatedPostRequest('/run_query', {
      tiers: ['free'],
      ...search,
    });
  }
}
