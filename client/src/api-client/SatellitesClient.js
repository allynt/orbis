import { snakeCase } from 'lodash';

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
    return this.makeAuthenticatedPostRequest('/run_query/', {
      tiers: ['free'],
      ...search,
    });
  }

  /**
   * @param {{
   *  userId: User['id'],
   *  customerId: Customer['id'],
   *  name: string,
   *  description?: string,
   *  satelliteId: import('typings/satellites').Satellite['id'],
   *  sceneId: import('typings/satellites').Scene['id'],
   *  visualisationId: import('typings/satellites').Visualisation['id'],
   * }} params
   */
  async saveImage({ customerId, userId, ...rest }) {
    return this.makeAuthenticatedPostRequest(
      `/datasources/${customerId}/${userId}/`,
      Object.entries(rest).reduce(
        (acc, [key, value]) => ({ ...acc, [snakeCase(key)]: value }),
        {},
      ),
    );
  }
}
