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

  set userKey(userKey) {
    this.#userKey = userKey;
  }

  get userKey() {
    return this.#userKey;
  }
}
