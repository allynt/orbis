import { ApiClient } from './ApiClient';

describe('ApiClient', () => {
  describe('constructor', () => {
    it('instantiates sub clients', () => {
      const apiClient = new ApiClient();
      expect(apiClient.bookmarks).toBeTruthy();
    });
  });

  describe('userKey', () => {
    it('Sets userKey on sub clients when set', () => {
      const apiClient = new ApiClient();
      apiClient.userKey = 'test-key-123';
      expect(apiClient.bookmarks.userKey).toBe('test-key-123');
    });
  });

  describe('apiHost', () => {
    it('sets apiHost for sub clients to process.env.REACT_APP_API_HOST if env is development', () => {
      // @ts-ignore
      process.env.NODE_ENV = 'development';
      process.env.REACT_APP_API_HOST = 'http://test-host.com';
      const apiClient = new ApiClient();
      expect(apiClient.bookmarks.apiHost).toBe('http://test-host.com');
    });

    it('sets apiHost for sub clients to window?._env_?.REACT_APP_API_HOST if env is not development', () => {
      // @ts-ignore
      process.env.NODE_ENV = 'something else';
      window._env_ = { REACT_APP_API_HOST: 'http://test-host.com' };
      const apiClient = new ApiClient();
      expect(apiClient.bookmarks.apiHost).toBe('http://test-host.com');
    });
  });
});
