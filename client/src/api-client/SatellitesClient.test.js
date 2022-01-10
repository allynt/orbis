import { SatellitesClient } from './SatellitesClient';

import { satellites, satelliteScenes } from 'mocks/fixtures/satellites';

describe('SatellitesClient', () => {
  /** @type {SatellitesClient} */
  let client;

  beforeEach(() => {
    client = new SatellitesClient();
  });

  describe('getSatellites', () => {
    it('Returns the fetchSatellites response', async () => {
      const response = await client.getSatellites();

      expect(response).toEqual(satellites);
    });
  });

  describe('runQuery', () => {
    it('Returns the search results', async () => {
      const query = {
        tiers: ['free'],
        satellites: ['sentinel-2'],
        start_date: '2021-11-22T00:00:00.000Z',
        end_date: '2021-12-22T23:59:59.999Z',
        aoi: [
          [-3.2167700195311553, 55.95040607448359],
          [-3.2167700195311553, 55.87651938767596],
          [-3.073947753906312, 55.87651938767596],
          [-3.073947753906312, 55.95040607448359],
          [-3.2167700195311553, 55.95040607448359],
        ],
      };

      const response = await client.runQuery(query);

      expect(response).toEqual(satelliteScenes);
    });
  });

  describe('saveImage', () => {
    it('Returns the response from the post', async () => {
      const data = {
        satellite_id: 'sentinel-2',
        scene_id:
          'S2A_MSIL2A_20211220T112501_N0301_R037_T30VVH_20211220T142010',
        visualisation_id: 'TCI',
        name: 'Test Image',
        description: 'Test Description',
      };

      const response = await client.saveImage(data);

      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Test Image',
            description: 'Test Description',
          }),
        ]),
      );
    });
  });
});
