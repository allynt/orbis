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

  /**
   * @param {RequestInfo} url
   * @param {RequestInit} options
   */
  async makeRequest(url, options = {}) {
    const response = await fetch(`${this.apiHost}/api${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        Authorization: `Token ${this.userKey}`,
      },
    });
    SubClient.handleErrors(response);
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
