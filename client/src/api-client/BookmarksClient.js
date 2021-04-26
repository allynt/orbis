import { SubClient } from './SubClient';

/** @typedef {import('typings/bookmarks').Bookmark} Bookmark */

export class BookmarksClient extends SubClient {
  /**
   * @returns {Promise<Bookmark[]>}
   * @throws {ResponseError}
   */
  async getBookmarks() {
    return fetch(`${this.apiHost}/api/bookmarks/`, {
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
   * @param {import('typings/bookmarks').RequestBookmark} bookmark
   * @returns {Promise<Bookmark>}
   * @throws {ResponseError}
   */
  async addBookmark(bookmark) {
    const formData = new FormData();
    Object.keys(bookmark).forEach(key => formData.append(key, bookmark[key]));
    // nested JSON should be stringified prior to passing to backend
    formData.set('center', JSON.stringify(bookmark['center']));
    formData.set('layers', JSON.stringify(bookmark['layers']));
    formData.set('orbs', JSON.stringify(bookmark['orbs']));
    formData.set(
      'drawn_feature_collection',
      JSON.stringify(bookmark['drawn_feature_collection']),
    );
    return fetch(`${this.apiHost}/api/bookmarks/`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json, application/xml, text/plain, text/html, *.*',
        Authorization: `Token ${this.userKey}`,
      },
      body: JSON.stringify(formData),
    })
      .then(SubClient.handleErrors)
      .then(response => response.json());
  }

  /**
   * @param {Bookmark['id']} bookmarkId
   * @throws {ResponseError}
   */
  async deleteBookmark(bookmarkId) {
    await fetch(`${this.apiHost}/api/bookmarks/${bookmarkId}/`, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${this.userKey}`,
      },
    }).then(SubClient.handleErrors);
  }
}
