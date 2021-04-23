export class ResponseError extends Error {
  /** @type {number} */
  status;

  /**
   * @param {Error['message']} message
   * @param {number} status
   */
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/** @typedef {import('typings/bookmarks').Bookmark} Bookmark */

/**
 * @param {Response} response
 * @returns {Response}
 */
const handleErrors = response => {
  if (!response.ok)
    throw new ResponseError(response.statusText, response.status);
  return response;
};

export class BookmarksClient {
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
   * @param {string} userKey
   */
  set userKey(userKey) {
    this.#userKey = userKey;
  }

  /**
   * @returns {Promise<Bookmark[]>}
   * @throws {ResponseError}
   */
  async getBookmarks() {
    return fetch(`${this.apiHost}/api/bookmarks`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${this.#userKey}`,
      },
    })
      .then(handleErrors)
      .then(response => response.json());
  }

  /**
   * @param {Partial<Bookmark>} bookmark
   * @returns {Bookmark}
   */
  addBookmark(bookmark) {}

  /**
   * @param {Bookmark['id']} bookmarkId
   */
  deleteBookmark(bookmarkId) {}
}
