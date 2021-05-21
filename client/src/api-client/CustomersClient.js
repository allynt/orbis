import { FIELD_NAMES } from 'utils/validators';
import { SubClient } from './SubClient';

export class CustomersClient extends SubClient {
  constructor() {
    super('/customers');
    this.fieldMapping = {
      createCustomer: {
        [FIELD_NAMES.customerName]: 'name',
        [FIELD_NAMES.customerNameOfficial]: 'official_name',
        [FIELD_NAMES.customerType]: 'company_type',
        [FIELD_NAMES.registeredNumber]: 'registered_id',
      },
      placeOrder: {
        paymentType: 'order_type',
        amount: 'cost',
        licences: 'n_licences',
        period: 'subscription_period',
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
    return this.makeAuthenticatedPostRequest('/', body);
  }

  /**
   * @param {Customer} updatedCustomer
   * @returns {Promise<Customer>}
   */
  async updateCustomer(updatedCustomer) {
    return this.makeAuthenticatedPutRequest(
      `/${updatedCustomer.id}/`,
      updatedCustomer,
    );
  }

  /**
   * @param {Customer['id']}customerId
   * @returns {Promise<CustomerUser[]>}
   */
  async getCustomerUsers(customerId) {
    const response = await this.makeAuthenticatedRequest(
      `/${customerId}/users/`,
    );
    return response.json();
  }

  /**
   * @param {Customer['id']} customerId
   * @param {{
   *  type?: CustomerUser['type']
   *  status?: CustomerUser['status']
   *  user: Partial<User>
   *  licences: CustomerUser['licences']
   * }} params
   * @returns {Promise<CustomerUser>}
   */
  async createCustomerUser(customerId, params) {
    return this.makeAuthenticatedPostRequest(`/${customerId}/users/`, params);
  }

  /**
   * @param {Customer['id']} customerId
   * @param {CustomerUser} userWithUpdates
   * @returns {Promise<CustomerUser>}
   */
  async updateCustomerUser(customerId, userWithUpdates) {
    return this.makeAuthenticatedPutRequest(
      `/${customerId}/users/${userWithUpdates.user.id}/`,
      userWithUpdates,
    );
  }

  /**
   * @param {Customer['id']} customerId
   * @param {User['id']} userId
   */
  async deleteCustomerUser(customerId, userId) {
    await this.makeAuthenticatedRequest(`/${customerId}/users/${userId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * @param {Customer['id']} customerId
   * @param {{
   *  type?: CustomerUser['type']
   *  status?: CustomerUser['status']
   *  user: Partial<User>
   *  licences: CustomerUser['licences']
   * }} customerUser
   * @returns {Promise<CustomerUser>}
   */
  async inviteCustomerUser(customerId, customerUser) {
    return this.makeAuthenticatedPostRequest(
      `/${customerId}/users/${customerUser.user.id}/invite/`,
      {},
    );
  }

  /**
   * @param {Customer['id']} customerId
   * @param {{
   *  subscription: string;
   *  paymentType: string;
   *  amount: number;
   *  licences: number;
   *  period: string;
   *  confirm: boolean;
   *}} order
   * @returns {Promise<Order>}
   */
  async placeOrder(customerId, order) {
    /** @type {any} */
    let body = this.mapParamsToApi(order, 'placeOrder');
    body = {
      order_type: body.order_type,
      cost: body.cost,
      items: [
        {
          orb: body.subscription,
          n_licences: body.n_licences,
          expiration: body.subscription_period,
        },
      ],
    };
    return this.makeAuthenticatedPostRequest(`/${customerId}/orders/`, body);
  }
}