import { AppClient } from './AppClient';
import { AuthenticationClient } from './AuthenticationClient';
import { BookmarksClient } from './BookmarksClient';
import { CustomersClient } from './CustomersClient';
import { DataClient } from './DataClient';
import { DocumentsClient } from './DocumentsClient';
import { OrbsClient } from './OrbsClient';
import { SatellitesClient } from './SatellitesClient';
import { StorageClient } from './StorageClient';
import { UsersClient } from './UsersClient';

export class ApiClient {
  app;
  authentication;
  bookmarks;
  customers;
  data;
  documents;
  orbs;
  satellites;
  users;
  storage;
  /** @private */
  subClients = [
    'app',
    'authentication',
    'bookmarks',
    'customers',
    'data',
    'documents',
    'orbs',
    'satellites',
    'users',
    'storage',
  ];

  constructor() {
    this.app = new AppClient();
    this.authentication = new AuthenticationClient();
    this.bookmarks = new BookmarksClient();
    this.customers = new CustomersClient();
    this.data = new DataClient();
    this.documents = new DocumentsClient();
    this.orbs = new OrbsClient();
    this.satellites = new SatellitesClient();
    this.users = new UsersClient();
    this.storage = new StorageClient();
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

  get apiHost() {
    return this.app.apiHost;
  }
}
