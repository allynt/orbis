import { OrbsClient } from './OrbsClient';

describe('OrbsClient', () => {
  /** @type {OrbsClient} */
  let client;

  beforeEach(() => {
    client = new OrbsClient();
  });

  describe('getOrbs', () => {
    it('Returns the list of orbs', async () => {
      const orbs = [
        {
          id: 1,
          name: 'Exploration',
          description: 'I am an orb',
          logo: null,
          features: ['satellites'],
          licence_cost: 0,
        },
      ];

      const response = await client.getOrbs();

      expect(response).toEqual(orbs);
    });
  });
});
