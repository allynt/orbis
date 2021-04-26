import { ResponseError } from './ResponseError';

export class SubClient {
  /** @type {string} */
  apiHost;
  /** @type {string} */
  userKey;
  /** @type {string} */
  endpoint;

  constructor(endpoint = '') {
    this.endpoint = endpoint;
  }

  /**
   * @param {Response} response
   * @returns {Response}
   */
  static handleErrors(response) {
    if (!response.ok)
      throw new ResponseError(response.statusText, response.status, response);
    return response;
  }

  /**
   * @param {RequestInfo} url
   * @param {RequestInit} options
   */
  async makeRequest(url = '', options = {}) {
    const response = await fetch(`${this.apiHost}/api${this.endpoint}${url}`, {
      credentials: 'include',
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
    });
    SubClient.handleErrors(response);
    return response;
  }

  /**
   * @param {RequestInfo} url
   * @param {RequestInit} options
   */
  async makeAuthenticatedRequest(url, options = {}) {
    return this.makeRequest(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Token ${this.userKey}`,
      },
    });
  }
}
