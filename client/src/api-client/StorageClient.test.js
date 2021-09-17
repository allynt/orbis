import fetch from 'jest-fetch-mock';

import { StorageClient } from './StorageClient';

describe('StorageClient', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('getFiles', () => {
    it('Returns storage files from the response', async () => {
      const files = [{ id: 1 }, { id: 2 }];
      fetch.once(JSON.stringify(files));
      const client = new StorageClient();
      const responseStorage = await client.getFiles();
      expect(responseStorage).toEqual(files);
    });
  });

  describe('deleteFile', () => {
    it('deletes the file from storage', async () => {
      const client = new StorageClient();
      await client.deleteFile(1);
      expect(fetch).toBeCalledWith(
        expect.stringContaining('/api/storage/1'),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
