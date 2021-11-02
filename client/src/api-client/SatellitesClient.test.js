import fetch from 'jest-fetch-mock';

import { SatellitesClient } from './SatellitesClient';

fetch.enableMocks();

describe('SatellitesClient', () => {
  /** @type {SatellitesClient} */
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

  describe('saveImage', () => {
    it('Returns the response from the post', async () => {
      const responseBody = { source_id: 'id-123' };
      const requestBody = {
        userId: 'user-id-123',
        customerId: 'customer-id-123',
        name: 'Test Name',
        description: 'Test description',
        satelliteId: 'sentinel-2',
        sceneId: 'scene-id-123',
        visualisationId: 'true-color',
      };
      fetch.once(JSON.stringify(responseBody));
      const response = await client.saveImage(requestBody);
      expect(fetch).toBeCalledWith(
        expect.stringContaining(
          `/${requestBody.customerId}/${requestBody.userId}/`,
        ),
        expect.objectContaining({
          body: JSON.stringify({
            name: requestBody.name,
            description: requestBody.description,
            satellite_id: requestBody.satelliteId,
            scene_id: requestBody.sceneId,
            visualisation_id: requestBody.visualisationId,
          }),
        }),
      );
      expect(response).toEqual(responseBody);
    });
  });
});
