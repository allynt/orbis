import fetch from 'jest-fetch-mock';
import { CustomersClient } from './CustomersClient';

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
