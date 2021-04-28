import { SubClient } from './SubClient';

export class CustomersClient extends SubClient {
  constructor() {
    super();
    this.endpoint = '/customers';
  }

  /**
   * @param {Customer['id']} customerId
   * @param {{
   *  type: CustomerUser['type']
   *  status: CustomerUser['status']
   *  user: Partial<User>
   *  licences: CustomerUser['licences']
   * }} params
   * @returns {Promise<CustomerUser>}
   */
  async createCustomerUser(customerId, params) {
    const response = await this.makeAuthenticatedRequest(
      `/${customerId}/users/`,
      {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.json();
  }
}
