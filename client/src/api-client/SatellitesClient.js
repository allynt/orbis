import { snakeCase } from 'lodash';

import { SubClient } from './SubClient';

export class SatellitesClient extends SubClient {
  constructor() {
    super('/satellites');
  }

  /** @returns {Promise<import('typings').Satellite[]>} */
  async getSatellites() {
    return (await this.makeAuthenticatedRequest('/')).json();
  }

  /**
   * @param {Pick<import('typings').SavedSearch, 'satellites' | 'start_date' | 'end_date' | 'aoi' >} search
   * @returns {Promise<import('typings').Scene[]>}
   */
  async runQuery(search) {
    return this.makeAuthenticatedPostRequest('/run_query/', {
      tiers: ['free'],
      ...search,
    });
  }

  /**
   * @param {{
   *  userId: import('typings').User['id'],
   *  customerId: import('typings').Customer['id'],
   *  name: string,
   *  description?: string,
   *  satelliteId: import('typings').Satellite['id'],
   *  sceneId: import('typings').Scene['id'],
   *  visualisationId: import('typings').Visualisation['id'],
   * }} params
   * @returns {Promise<import('typings').Source>}
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
