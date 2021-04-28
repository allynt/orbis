import fetch from 'jest-fetch-mock';
import { CustomersClient } from './CustomersClient';

describe('CustomersClient', () => {
  /** @type {CustomersClient} */
  let client;
  beforeEach(() => {
    fetch.resetMocks();
    client = new CustomersClient();
  });

  describe('createCustomerUser', () => {
    it('returns the response body', async () => {
      const body = { user: { email: 'test@test.com' } },
        customerId = '123-id';
      fetch.doMockOnceIf(
        new RegExp(`/customers/${customerId}/users/`),
        JSON.stringify(body),
      );
      const responseBody = await client.createCustomerUser(customerId, {
        type: 'MANAGER',
        status: 'ACTIVE',
        user: {
          email: 'test@test.com',
        },
        licences: [],
      });
      expect(responseBody).toEqual(body);
    });
  });
});
