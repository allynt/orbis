import { StorageClient } from './StorageClient';

import { getStorage } from 'mocks/fixtures/mission-control/storage';

describe('StorageClient', () => {
  let client = null;

  beforeEach(() => {
    client = new StorageClient();
  });

  describe('getFiles', () => {
    it('Returns storage files from the response', async () => {
      const files = getStorage();

      const response = await client.getFiles();

      expect(response).toEqual(files);
    });
  });

  describe('deleteFile', () => {
    it('deletes the file from storage', async () => {
      const response = await client.deleteFile(1);

      const files = getStorage();

      expect(response).toEqual(files);
    });
  });
});
