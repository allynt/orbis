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
   * @param {Pick<import('typings/satellites').SavedSearch, 'satellites' | 'start_date' | 'end_date' | 'aoi' >} search
   * @returns {Promise<import('typings/satellites').Scene[]>}
   */
  async runQuery(search) {
    return this.makeAuthenticatedPostRequest('/run_query', {
      tiers: ['free'],
      ...search,
    });
  }
}
