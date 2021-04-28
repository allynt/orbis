import { ResponseError } from './ResponseError';

export class SubClient {
  /** @type {string} */
  apiHost;
  /** @type {string} */
  userKey;
  /** @type {string} */
  endpoint;
  /** @type {Record<string, Record<string, string>>} */
  fieldMapping;

  constructor(endpoint = '') {
    this.endpoint = endpoint;
  }

  /**
   * @param {Response} response
   * @returns {Response}
   */
  static handleErrors(response) {
    if (!response.ok) throw new ResponseError(response);
    return response;
  }

  /**
   * @param {Record<string, any>} params
   * @param {string} mappingKey
   */
  mapParamsToApi(params, mappingKey) {
    const mapping = this.fieldMapping[mappingKey];
    return Object.entries(params).reduce(
      (prev, [key, value]) => ({
        ...prev,
        [mapping[key] || key]: value,
      }),
      {},
    );
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
