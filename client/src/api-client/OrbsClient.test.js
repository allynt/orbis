import fetch from 'jest-fetch-mock';

import { OrbsClient } from './OrbsClient';

fetch.enableMocks();

describe('OrbsClient', () => {
  /** @type {OrbsClient} */
  let client;

  beforeEach(() => {
    fetch.resetMocks();
    client = new OrbsClient();
  });

  describe('getOrbs', () => {
    it('Returns the list of orbs', async () => {
      const orbs = [{ id: 1 }, { id: 2 }];
      fetch.once(JSON.stringify(orbs));
      const response = await client.getOrbs();
      expect(response).toEqual(orbs);
    });
  });
});
