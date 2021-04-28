import { FIELD_NAMES } from 'utils/validators';
import { SubClient } from './SubClient';

export class CustomersClient extends SubClient {
  constructor() {
    super();
    this.endpoint = '/customers';
    this.fieldMapping = {
      createCustomer: {
        [FIELD_NAMES.customerName]: 'name',
        [FIELD_NAMES.customerNameOfficial]: 'official_name',
        [FIELD_NAMES.customerType]: 'company_type',
        [FIELD_NAMES.registeredNumber]: 'registered_id',
      },
    };
  }

  /**
   * @param {Customer['id']} customerId
   * @returns {Promise<Customer>}
   */
  async getCustomer(customerId) {
    const response = await this.makeAuthenticatedRequest(`/${customerId}`);
    return response.json();
  }

  /**
   * @param {{
   *  email: string
   *  customerName: string
   *  customerNameOfficial: string
   *  customerType: Customer['type']
   *  registeredNumber: Customer['registered_id']
   *  licence: 'Orbis Core'
   *  numberOfLicences: number
   *  subscriptionPeriod: string
   *  type: Customer['type']
   * }} newCustomer
   * @returns {Promise<Customer>}
   */
  async createCustomer(newCustomer) {
    const body = this.mapParamsToApi(newCustomer, 'createCustomer');
    const response = await this.makeAuthenticatedRequest('/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
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
