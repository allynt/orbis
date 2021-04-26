import { ResponseError } from './ResponseError';

export class SubClient {
  /** @type {string} */
  #apiHost;
  /** @type {string} */
  #userKey;

  /**
   * @param {Response} response
   * @returns {Response}
   */
  static handleErrors(response) {
    if (!response.ok)
      throw new ResponseError(response.statusText, response.status);
    return response;
  }

  set apiHost(apiHost) {
    this.#apiHost = apiHost;
  }

  get apiHost() {
    return this.#apiHost;
  }

  set userKey(userKey) {
    this.#userKey = userKey;
  }

  get userKey() {
    return this.#userKey;
  }
}
