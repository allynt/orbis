import { SubClient } from './SubClient';

/** @typedef {import('typings').Bookmark} Bookmark */

export class BookmarksClient extends SubClient {
  constructor() {
    super('/bookmarks');
  }

  /**
   * @returns {Promise<Bookmark[]>}
   * @throws {ResponseError}
   */
  async getBookmarks() {
    const response = await this.makeAuthenticatedRequest('/');
    return response.json();
  }

  /**
   * @param {import('typings').RequestBookmark} bookmark
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
    const response = await this.makeAuthenticatedRequest('/', {
      method: 'POST',
      headers: {
        Accept: 'application/json, application/xml, text/plain, text/html, *.*',
      },
      body: formData,
    });

    return response.json();
  }

  /**
   * @param {Bookmark['id']} bookmarkId
   * @throws {ResponseError}
   */
  async deleteBookmark(bookmarkId) {
    return await this.makeAuthenticatedRequest(`/${bookmarkId}/`, {
      method: 'DELETE',
    });
  }
}
