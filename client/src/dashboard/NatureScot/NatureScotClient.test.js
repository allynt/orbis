import { rest } from 'msw';

import { server } from 'mocks/server';

import { NatureScotClient } from './NatureScotClient';

describe('NatureScotClient', () => {
  let client = null;

  beforeEach(() => {
    client = new NatureScotClient();
  });

  describe('Requests', () => {
    it('should fetch impact activities', async () => {
      const activities = [
        {
          value: 1,
          label: 'Accumulation of organic material',
          proposed: true,
        },
        {
          value: 2,
          label: 'Physical alteration of a water body',
          proposed: false,
        },
      ];

      server.use(
        rest.post(
          '*/api/proxy/data/ns/proxy/activities/latest',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(activities));
          },
        ),
      );

      const url = '/ns/proxy/activities/latest/';
      const form = {
        description: 'Build a burn',
        startDate: '2000-01-01T00:00:00.000Z',
        endDate: '2000-02-01T00:00:00.000Z',
        activities: [{ id: 1 }, { id: 2 }],
      };

      const response = await client.getImpactData(url, form);

      expect(response).toEqual(activities);
    });

    it('should run an impact assessment', async () => {
      const assessment = {
        summary: [],
        areas: [],
        impacts: [],
      };

      server.use(
        rest.post(
          '*/api/proxy/data/ns/proxy/impact/latest',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(assessment));
          },
        ),
      );

      const url = '/ns/proxy/impact/latest/';
      const form = {
        description: 'Build a burn',
        startDate: '2000-01-01T00:00:00.000Z',
        endDate: '2000-02-01T00:00:00.000Z',
        activities: [{ id: 1 }, { id: 2 }],
      };

      const response = await client.getImpactData(url, form);

      expect(response).toEqual(assessment);
    });
  });
});
