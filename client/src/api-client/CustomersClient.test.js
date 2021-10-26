import fetch from 'jest-fetch-mock';

import { CustomersClient } from './CustomersClient';

fetch.enableMocks();

describe('CustomersClient', () => {
  /** @type {CustomersClient} */
  let client;
  beforeEach(() => {
    fetch.resetMocks();
    client = new CustomersClient();
  });

  describe('getCustomer', () => {
    it('returns the response body', async () => {
      const body = { name: 'test_customer' };
      const customerId = '123';
      fetch.mockOnceIf(new RegExp(`/${customerId}`), JSON.stringify(body));
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
      fetch.mockOnceIf(/customers/, JSON.stringify(body));
      const responseBody = await client.createCustomer(params);
      expect(responseBody).toEqual(body);
    });

    it('Maps properties to api', () => {
      const params = {
        customerName: 'Test Customer',
        customerNameOfficial: 'Test Customer Ltd',
        customerType: 'Big',
        registeredNumber: '123',
      };
      fetch.once(JSON.stringify(''));
      client.createCustomer(params);
      expect(fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({
            name: params.customerName,
            official_name: params.customerNameOfficial,
            company_type: params.customerType,
            registered_id: params.registeredNumber,
          }),
        }),
      );
    });
  });

  describe('updateCustomer', () => {
    it('returns the updated customer', async () => {
      const updatedCustomer = { id: '123', name: 'Test Customer' };
      fetch.mockOnceIf(
        new RegExp(`${updatedCustomer.id}`),
        JSON.stringify(updatedCustomer),
      );
      const response = await client.updateCustomer(updatedCustomer);
      expect(response).toEqual(updatedCustomer);
    });
  });

  describe('getCustomerUsers', () => {
    it('Returns the customer users from the response', async () => {
      const customerId = '123',
        customerUsers = [{ id: 1 }, { id: 2 }];
      fetch.mockOnceIf(
        new RegExp(`${customerId}/users`),
        JSON.stringify(customerUsers),
      );
      const response = await client.getCustomerUsers(customerId);
      expect(response).toEqual(customerUsers);
    });
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

  describe('updateCustomerUser', () => {
    it('returns the updated customer user from the response', async () => {
      const userWithUpdates = {
          id: 1,
          user: { id: '123' },
        },
        customerId = 'cust-id-123',
        expected = { ...userWithUpdates, customer: customerId };
      fetch.mockOnceIf(
        new RegExp(`/${customerId}/users/${userWithUpdates.user.id}`),
        JSON.stringify({ ...userWithUpdates, customer: customerId }),
      );
      const response = await client.updateCustomerUser(
        customerId,
        userWithUpdates,
      );
      expect(response).toEqual(expected);
    });
  });

  describe('deleteCustomerUser', () => {
    it('Makes the delete request', () => {
      fetch.once(JSON.stringify({}));
      const customerId = 'cust-id-123',
        userId = 'user-id-123';
      client.deleteCustomerUser(customerId, userId);
      expect(fetch).toBeCalledWith(
        expect.stringContaining(`/${customerId}/users/${userId}/`),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('inviteCustomerUser', () => {
    it('Returns the invited customer user', async () => {
      const userId = 'user-id-123',
        user = { user: { id: userId } },
        newUser = { id: 1, user: { id: userId } },
        customerId = 'cust-id-123';
      fetch.mockOnceIf(
        new RegExp(`/${customerId}/users/${userId}/invite/`),
        JSON.stringify(newUser),
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
      fetch.mockOnceIf(
        new RegExp(`${customerId}/orders/`),
        JSON.stringify(body),
      );
      const response = await client.placeOrder(customerId, order);
      expect(response).toEqual(body);
    });

    it('transforms values to correct structure', () => {
      const order = {
        subscription: 'free',
        paymentType: 'card',
        amount: 123,
        licences: 10,
        period: 'year',
        confirm: true,
      };
      const transformed = {
        order_type: order.paymentType,
        cost: order.amount,
        items: [
          {
            orb: order.subscription,
            n_licences: order.licences,
            expiration: order.period,
          },
        ],
      };
      fetch.once(JSON.stringify({}));
      client.placeOrder('', order);
      expect(fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({ body: JSON.stringify(transformed) }),
      );
    });
  });
});
