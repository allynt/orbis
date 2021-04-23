import { SubClient } from './SubClient';

/** @typedef {import('typings/bookmarks').Bookmark} Bookmark */

export class BookmarksClient extends SubClient {
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
        Authorization: `Token ${this.userKey}`,
      },
    })
      .then(SubClient.handleErrors)
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
