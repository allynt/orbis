import { AoiClient } from './AoisClient';

describe('AoisClient', () => {
  let client;

  beforeEach(() => {
    client = new AoiClient();
  });

  it('should return the response from the post request', async () => {
    const responseBody = { source_id: 'id-123' };
    fetch.once(JSON.stringify(responseBody));

    const requestBody = {
      userId: 'user-id-123',
      customerId: 'customer-id-123',
      name: 'Test Name',
      description: 'Test description',
      geometry: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      zoom: 10,
    };
    const response = await client.saveAoi(requestBody);

    expect(fetch).toBeCalledWith(
      expect.stringContaining(
        `/${requestBody.customerId}/${requestBody.userId}/`,
      ),
      expect.objectContaining({
        body: JSON.stringify({
          name: requestBody.name,
          description: requestBody.description,
          geometry: requestBody.geometry,
          zoom: requestBody.zoom,
        }),
      }),
    );

    expect(response).toEqual(responseBody);
  });
});
