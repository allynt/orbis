import { AppClient } from './AppClient';
import { BookmarksClient } from './BookmarksClient';
import { DataClient } from './DataClient';
import { UsersClient } from './UsersClient';

export class ApiClient {
  app;
  bookmarks;
  data;
  users;
  /** @private */
  subClients = ['app', 'bookmarks', 'data', 'users'];

  constructor() {
    this.app = new AppClient();
    this.bookmarks = new BookmarksClient();
    this.data = new DataClient();
    this.users = new UsersClient();
    this.apiHost =
      process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_API_HOST
        : window?._env_?.REACT_APP_API_HOST;
  }

  /**
   * @private
   * @param {'userKey' | 'apiHost'} key
   * @param {string} value
   */
  setSubClientMember(key, value) {
    this.subClients.forEach(client => (this[client][key] = value));
  }

  /**
   * @param {string} userKey
   */
  set userKey(userKey) {
    this.setSubClientMember('userKey', userKey);
  }

  /**
   * @param {string} apiHost
   */
  set apiHost(apiHost) {
    this.setSubClientMember('apiHost', apiHost);
  }
}
