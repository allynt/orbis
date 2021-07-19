import fetch from 'jest-fetch-mock';

import { SatellitesClient } from './SatellitesClient';

describe('SatellitesClient', () => {
  let client;
  const responseBody = [{ id: 1 }, { id: 2 }];

  beforeEach(() => {
    fetch.resetMocks();
    client = new SatellitesClient();
  });

  describe('getSatellites', () => {
    it('Returns the fetchSatellites response', async () => {
      fetch.once(JSON.stringify(responseBody));
      const response = await client.getSatellites();
      expect(response).toEqual(responseBody);
    });
  });

  describe('runQuery', () => {
    it('Returns the search results', async () => {
      fetch.once(JSON.stringify(responseBody));
      const response = await client.runQuery({
        satellites: ['sat1', 'sat2'],
        start_date: new Date(2000, 0, 1).toISOString(),
        end_date: new Date(2001, 0, 1).toISOString(),
      });
      expect(response).toEqual(responseBody);
    });
  });
});
