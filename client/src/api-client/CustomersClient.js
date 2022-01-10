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
   * @param {import('typings').Customer['id']} customerId
   * @returns {Promise<import('typings').Customer>}
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
   *  customerType: import('typings').Customer['type']
   *  registeredNumber: import('typings').Customer['registered_id']
   *  licence: string
   *  numberOfLicences: number
   *  subscriptionPeriod: string
   *  type: import('typings').Customer['type']
   * }} newCustomer
   * @returns {Promise<import('typings').Customer>}
   */
  async createCustomer(newCustomer) {
    const body = this.mapParamsToApi(newCustomer, 'createCustomer');
    return this.makeAuthenticatedPostRequest('/', body);
  }

  /**
   * @param {import('typings').Customer} updatedCustomer
   * @returns {Promise<import('typings').Customer>}
   */
  async updateCustomer(updatedCustomer) {
    return this.makeAuthenticatedPutRequest(
      `/${updatedCustomer.id}/`,
      updatedCustomer,
    );
  }

  /**
   * @param {import('typings').Customer['id']}customerId
   * @returns {Promise<import('typings').CustomerUser[]>}
   */
  async getCustomerUsers(customerId) {
    const response = await this.makeAuthenticatedRequest(
      `/${customerId}/users/`,
    );
    return response.json();
  }

  /**
   * @param {import('typings').Customer['id']} customerId
   * @param {{
   *  type?: import('typings').CustomerUser['type']
   *  status?: import('typings').CustomerUser['status']
   *  user: Partial<import('typings').User>
   *  licences: import('typings').CustomerUser['licences']
   * }} params
   * @returns {Promise<import('typings').CustomerUser>}
   */
  async createCustomerUser(customerId, params) {
    return this.makeAuthenticatedPostRequest(`/${customerId}/users/`, params);
  }

  /**
   * @param {import('typings').Customer['id']} customerId
   * @param {import('typings').CustomerUser} userWithUpdates
   * @returns {Promise<import('typings').CustomerUser>}
   */
  async updateCustomerUser(customerId, userWithUpdates) {
    return this.makeAuthenticatedPutRequest(
      `/${customerId}/users/${userWithUpdates.user.id}/`,
      userWithUpdates,
    );
  }

  /**
   * @param {import('typings').Customer['id']} customerId
   * @param {import('typings').User['id']} userId
   */
  async deleteCustomerUser(customerId, userId) {
    return await this.makeAuthenticatedRequest(
      `/${customerId}/users/${userId}/`,
      {
        method: 'DELETE',
      },
    );
  }

  /**
   * @param {import('typings').Customer['id']} customerId
   * @param {{
   *  type?: import('typings').CustomerUser['type']
   *  status?: import('typings').CustomerUser['status']
   *  user: Partial<import('typings').User>
   *  licences: import('typings').CustomerUser['licences']
   * }} customerUser
   * @returns {Promise<import('typings').CustomerUser>}
   */
  async inviteCustomerUser(customerId, customerUser) {
    return this.makeAuthenticatedPostRequest(
      `/${customerId}/users/${customerUser.user.id}/invite/`,
      {},
    );
  }

  /**
   * @param {import('typings').Customer['id']} customerId
   * @param {{
   *  subscription: string;
   *  paymentType?: string;
   *  amount?: number;
   *  licences: number;
   *  period?: string;
   *}} order
   * @returns {Promise<import('typings').Order>}
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
