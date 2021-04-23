import { BookmarksClient } from './BookmarksClient';

export class ApiClient {
  bookmarks;
  #subClients = ['bookmarks'];

  constructor() {
    this.bookmarks = new BookmarksClient();
  }

  /**
   * @param {string} userKey
   */
  set userKey(userKey) {
    this.#subClients.forEach(client => (this[client].userKey = userKey));
  }
}
