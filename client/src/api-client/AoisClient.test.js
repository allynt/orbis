import { AoiClient } from './AoisClient';

describe('AoisClient', () => {
  let client;

  beforeEach(() => {
    client = new AoiClient();
  });

  it('should return AOIs from the response', async () => {
    const aois = [{ id: 1 }, { id: 2 }];
    fetch.once(JSON.stringify(aois));

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
      // thumbnail: 10,
    };
    const responseAoi = { ...newAoi, id: 123 };
    fetch.once(JSON.stringify(responseAoi));

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
      // thumbnail: 10,
    };
    fetch.once(JSON.stringify(updatedAoi));

    const client = new AoiClient();
    await client.updateAoi(updatedAoi);

    expect(fetch).toBeCalledWith(
      expect.stringContaining('/api/aois/1/'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('should delete the AOI', async () => {
    const client = new AoiClient();
    await client.deleteAoi(1);

    expect(fetch).toBeCalledWith(
      expect.stringContaining('/api/aois/1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
