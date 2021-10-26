import fetch from 'jest-fetch-mock';

import { DataClient } from './DataClient';

describe('DataClient', () => {
  describe('getSources', () => {
    it('Returns sources from response', async () => {
      const sources = [{ id: 1 }, { id: 2 }];
      fetch.enableMocks();
      fetch.once(JSON.stringify(sources));
      const client = new DataClient();
      const responseSources = await client.getSources();
      expect(responseSources).toEqual(sources);
    });
  });
});
