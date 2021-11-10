import { snakeCase } from 'lodash';

import { SubClient } from './SubClient';

export class AoiClient extends SubClient {
  constructor() {
    super('/aois');
  }

  async saveAoi({ customerId, userId, ...rest }) {
    return this.makeAuthenticatedPostRequest(
      `/${customerId}/${userId}/`,
      Object.entries(rest).reduce(
        (acc, [key, value]) => ({ ...acc, [snakeCase(key)]: value }),
        {},
      ),
    );
  }
}
