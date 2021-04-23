import { ResponseError } from './ResponseError';

export class SubClient {
  /** @type {string} */
  apiHost;
  /** @type {string} */
  #userKey;

  constructor() {
    this.apiHost =
      process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_API_HOST
        : window?._env_?.REACT_APP_API_HOST;
  }

  /**
   * @param {Response} response
   * @returns {Response}
   */
  static handleErrors(response) {
    if (!response.ok)
      throw new ResponseError(response.statusText, response.status);
    return response;
  }

  set userKey(userKey) {
    this.#userKey = userKey;
  }

  get userKey() {
    return this.#userKey;
  }
}
