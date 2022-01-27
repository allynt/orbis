import { rest } from 'msw';
import { server } from 'mocks/server';

import { CustomersClient } from './CustomersClient';

describe('CustomersClient', () => {
  /** @type {CustomersClient} */
  let client;

  beforeEach(() => {
    client = new CustomersClient();
  });

  describe('getCustomer', () => {
    it('returns the response body', async () => {
      const body = { name: 'test_customer' };
      const customerId = '123';

      server.use(
        rest.get('*/api/customers/:customerId', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(body));
        }),
      );

      const responseBody = await client.getCustomer(customerId);
      expect(responseBody).toEqual(body);
    });
  });

  describe('createCustomer', () => {
    it('Returns the new customer', async () => {
      const params = {
          name: 'New Customer',
        },
        body = {
          ...params,
          id: 'new-id-123',
        };

      server.use(
        rest.post('*/api/customers/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(body));
        }),
      );

      const responseBody = await client.createCustomer(params);
      expect(responseBody).toEqual(body);
    });

    it('Maps properties to api', async () => {
      const params = {
        customerName: 'Test Customer',
        customerNameOfficial: 'Test Customer Ltd',
        customerType: 'Big',
        registeredNumber: '123',
      };

      server.use(
        rest.post('*/api/customers/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const response = await client.createCustomer(params);
      expect(response).toStrictEqual({});
    });
  });

  describe('updateCustomer', () => {
    it('returns the updated customer', async () => {
      const updatedCustomer = { id: '123', name: 'Test Customer' };

      server.use(
        rest.put('*/api/customers/:customerId', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(updatedCustomer));
        }),
      );

      const response = await client.updateCustomer(updatedCustomer);
      expect(response).toEqual(updatedCustomer);
    });
  });

  describe('getCustomerUsers', () => {
    it('Returns the customer users from the response', async () => {
      const customerId = '123',
        customerUsers = [{ id: 1 }, { id: 2 }];

      server.use(
        rest.get('*/api/customers/:customerId/users/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(customerUsers));
        }),
      );

      const response = await client.getCustomerUsers(customerId);
      expect(response).toEqual(customerUsers);
    });
  });

  describe('createCustomerUser', () => {
    it('returns the response body', async () => {
      const body = { user: { email: 'test@test.com' } },
        customerId = '123-id';

      server.use(
        rest.post('*/api/customers/:customerId/users/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(body));
        }),
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

  describe('updateCustomerUser', () => {
    it('returns the updated customer user from the response', async () => {
      const userWithUpdates = {
          id: 1,
          user: { id: '123' },
        },
        customerId = 'cust-id-123',
        expected = { ...userWithUpdates, customer: customerId };

      server.use(
        rest.put(
          '*/api/customers/:customerId/users/:userId/',
          (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({ ...userWithUpdates, customer: customerId }),
            );
          },
        ),
      );

      const response = await client.updateCustomerUser(
        customerId,
        userWithUpdates,
      );
      expect(response).toEqual(expected);
    });
  });

  describe('deleteCustomerUser', () => {
    it('Makes the delete request', async () => {
      server.use(
        rest.delete(
          '*/api/customers/:customerId/users/:userId/',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({}));
          },
        ),
      );

      const customerId = 'cust-id-123',
        userId = 'user-id-123';
      const response = await client.deleteCustomerUser(customerId, userId);

      expect(response.ok).toBe(true);
    });
  });

  describe('inviteCustomerUser', () => {
    it('Returns the invited customer user', async () => {
      const userId = 'user-id-123',
        user = { user: { id: userId } },
        newUser = { id: 1, user: { id: userId } },
        customerId = 'cust-id-123';

      server.use(
        rest.post(
          '*/api/customers/:customerId/users/:userId/invite/',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(newUser));
          },
        ),
      );

      const response = await client.inviteCustomerUser(customerId, user);
      expect(response).toEqual(newUser);
    });
  });

  describe('placeOrder', () => {
    it('returns the response body', async () => {
      const order = { id: '123' };
      const customerId = 'cust-id-123';
      const body = { id: '456' };

      server.use(
        rest.post('*/api/customers/:customerId/orders/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(body));
        }),
      );

      const response = await client.placeOrder(customerId, order);
      expect(response).toEqual(body);
    });

    it('transforms values to correct structure', async () => {
      const order = {
        subscription: 'free',
        paymentType: 'card',
        amount: 123,
        licences: 10,
        period: 'year',
        confirm: true,
      };

      server.use(
        rest.post('*/api/customers//orders/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const response = await client.placeOrder('', order);
      expect(response).toStrictEqual({});
    });
  });
});
