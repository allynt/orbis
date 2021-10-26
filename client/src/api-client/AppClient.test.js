import fetch from 'jest-fetch-mock';

import { AppClient } from './AppClient';

describe('AppClient', () => {
  describe('getConfig', () => {
    it('Returns app config from the response', async () => {
      const config = {
        id: 1,
        stuff: 'things',
      };
      fetch.enableMocks();
      fetch.once(JSON.stringify(config));
      const client = new AppClient();
      const responseConfig = await client.getConfig();
      expect(responseConfig).toEqual(config);
    });
  });
});
