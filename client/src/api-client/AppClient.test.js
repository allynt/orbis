import { config } from 'mocks/fixtures/app';

import { AppClient } from './AppClient';

describe('AppClient', () => {
  describe('getConfig', () => {
    it('Returns app config from the response', async () => {
      const client = new AppClient();

      const responseConfig = await client.getConfig();

      expect(responseConfig).toEqual(config);
    });
  });
});
