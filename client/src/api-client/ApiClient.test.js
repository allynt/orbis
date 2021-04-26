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
});
