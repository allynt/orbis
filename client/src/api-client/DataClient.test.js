import { rest } from 'msw';
import { server } from 'mocks/server';

import { DataClient } from './DataClient';

describe('DataClient', () => {
  describe('getSources', () => {
    it('Returns sources from response', async () => {
      const sources = [{ id: 1 }, { id: 2 }];

      server.use(
        rest.get('*/api/data/sources/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(sources));
        }),
      );

      const client = new DataClient();
      const responseSources = await client.getSources();
      expect(responseSources).toEqual(sources);
    });
  });
});
