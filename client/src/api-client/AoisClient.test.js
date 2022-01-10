import { rest } from 'msw';
import { server } from 'mocks/server';

import { AoiClient } from './AoisClient';

describe('AoisClient', () => {
  let client;

  beforeEach(() => {
    client = new AoiClient();
  });

  it('should return AOIs from the response', async () => {
    const aois = [{ id: 1 }, { id: 2 }];

    server.use(
      rest.get('*/api/aois/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(aois));
      }),
    );

    const client = new AoiClient();
    const responseAois = await client.getAois();

    expect(responseAois).toEqual(aois);
  });

  it('should return the response from the Add AOI request', async () => {
    const newAoi = {
      name: 'Test Name',
      description: 'Test description',
      geometry: JSON.stringify({
        type: 'Polygon',
        geometry: {
          coordinates: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        },
      }),
    };
    const responseAoi = { ...newAoi, id: 123 };

    server.use(
      rest.post('*/api/aois/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(responseAoi));
      }),
    );

    const aoi = await client.saveAoi(newAoi);

    expect(aoi).toEqual(responseAoi);
  });

  it('should update the AOI', async () => {
    const updatedAoi = {
      id: 1,
      name: 'Test Name Updated',
      description: 'Test description',
      geometry: JSON.stringify({
        type: 'Polygon',
        geometry: {
          coordinates: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [2, 2],
            [0, 0],
          ],
        },
      }),
    };

    server.use(
      rest.put('*/api/aois/:id/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(updatedAoi));
      }),
    );

    const client = new AoiClient();
    const response = await client.updateAoi(updatedAoi);

    expect(response).toEqual(updatedAoi);
  });

  it('should delete the AOI', async () => {
    server.use(
      rest.delete('*/api/aois/:id/', (req, res, ctx) => {
        return res(ctx.status(200));
      }),
    );

    const client = new AoiClient();
    const response = await client.deleteAoi(1);

    expect(response.ok).toBe(true);
  });
});
