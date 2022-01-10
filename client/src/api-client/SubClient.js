import { ResponseError } from './ResponseError';

const JSON_POST_REQUEST_OPTIONS = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
};

const JSON_PUT_REQUEST_OPTIONS = {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
};

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
   * @template T
   * @param {RequestInfo} url
   * @param {any} body
   * @returns {Promise<T>}
   */
  async makePostRequest(url, body) {
    const response = await this.makeRequest(url, {
      ...JSON_POST_REQUEST_OPTIONS,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  /**
   * @param {RequestInfo} url
   * @param {RequestInit} options
   */
  async makeAuthenticatedRequest(url, options = {}) {
    // TODO: 'Authorization' and '...options.headers' switched, make sure this doesn't break other usages of this
    return this.makeRequest(url, {
      ...options,
      headers: {
        Authorization: `Token ${this.userKey}`,
        ...options.headers,
      },
    });
  }

  /**
   * @template T
   * @param {RequestInfo} url
   * @param {any} body
   * @returns {Promise<T>}
   */
  async makeAuthenticatedPostRequest(url, body = {}) {
    const response = await this.makeAuthenticatedRequest(url, {
      ...JSON_POST_REQUEST_OPTIONS,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  /**
   * @template T
   * @param {RequestInfo} url
   * @param {any} body
   * @returns {Promise<T>}
   */
  async makeAuthenticatedPutRequest(url, body) {
    const response = await this.makeAuthenticatedRequest(url, {
      ...JSON_PUT_REQUEST_OPTIONS,
      body: JSON.stringify(body),
    });
    return response.json();
  }
}
