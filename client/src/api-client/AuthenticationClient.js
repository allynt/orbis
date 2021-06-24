import { FIELD_NAMES } from 'utils/validators';

import { SubClient } from './SubClient';

export class AuthenticationClient extends SubClient {
  constructor() {
    super('/authentication');
    this.fieldMapping = {
      registerUser: {
        [FIELD_NAMES.email]: 'email',
        [FIELD_NAMES.organisationName]: 'customer_name',
        [FIELD_NAMES.newPassword]: 'password1',
        [FIELD_NAMES.newPasswordConfirm]: 'password2',
        [FIELD_NAMES.acceptedTerms]: 'accepted_terms',
      },
      changePassword: {
        [FIELD_NAMES.newPassword]: 'new_password1',
        [FIELD_NAMES.newPasswordConfirm]: 'new_password2',
      },
      resetPasswordVerify: {
        [FIELD_NAMES.newPassword]: 'new_password1',
        [FIELD_NAMES.newPasswordConfirm]: 'new_password2',
      },
    };
  }

  /**
   * @param {{
   *  email: User['email']
   *  password: string
   *  accepted_terms: User['accepted_terms']
   * }} loginParams
   * @returns {Promise<{user: PartialUser, token: string}>}
   */
  async login(loginParams) {
    return this.makePostRequest('/login/', loginParams);
  }

  async logout() {
    await this.makeAuthenticatedRequest('/logout/', { method: 'POST' });
  }

  /**
   * @param {{
   *   email: string
   *   newPassword: string
   *   newPasswordConfirm: string
   *   acceptedTerms: boolean
   *   registration_stage: User['registration_stage']
   * }} registerUserParams
   * @returns {Promise<PartialUser>}
   */
  async registerUser(registerUserParams) {
    const body = this.mapParamsToApi(registerUserParams, 'registerUser');
    return this.makePostRequest('/registration/', body);
  }

  /**
   * @param {{key: string}} verifyEmailParams
   * @returns {Promise<{user: PartialUser}>}
   */
  async verifyEmail(verifyEmailParams) {
    return this.makePostRequest(
      '/registration/verify-email/',
      verifyEmailParams,
    );
  }

  /**
   * @param {{email: User['email']}} sendVerificationEmailParams
   * @returns {Promise<{email: User['email']}>}
   */
  async sendVerificationEmail(sendVerificationEmailParams) {
    return this.makePostRequest(
      '/send-email-verification/',
      sendVerificationEmailParams,
    );
  }

  /**
   * @param {{newPassword: string, newPasswordConfirm: string}} changePasswordParams
   * @returns {Promise<{new_password1: string, new_password2: string}>}
   */
  async changePassword(changePasswordParams) {
    const body = this.mapParamsToApi(changePasswordParams, 'changePassword');
    return this.makeAuthenticatedPostRequest('/password/change/', body);
  }

  /**
   * @param {{email: User['email']}} resetPasswordRequestParams
   * @returns {Promise<{email: User['email']}>}
   */
  async resetPasswordRequest(resetPasswordRequestParams) {
    return this.makePostRequest('/password/reset/', resetPasswordRequestParams);
  }

  /**
   * @param {{
   *  newPassword: string
   *  newPasswordConfirm: string
   *  uid: string
   *  token: string
   * }} resetPasswordVerifyParams
   * @returns {Promise<{
   *  user: PartialUser
   * }>}
   */
  async resetPasswordVerify(resetPasswordVerifyParams) {
    const body = this.mapParamsToApi(
      resetPasswordVerifyParams,
      'resetPasswordVerify',
    );
    return this.makePostRequest('/password/verify-reset/', body);
  }
}
