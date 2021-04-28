import { FIELD_NAMES } from 'utils/validators';
import { SubClient } from './SubClient';

const FIELD_MAPPING = {
  registerUser: {
    [FIELD_NAMES.email]: 'email',
    [FIELD_NAMES.newPassword]: 'password1',
    [FIELD_NAMES.newPasswordConfirm]: 'password2',
    [FIELD_NAMES.acceptedTerms]: 'accepted_terms',
  },
  changePassword: {
    [FIELD_NAMES.newPassword]: 'new_password1',
    [FIELD_NAMES.newPasswordConfirm]: 'new_password2',
  },
};

export class AuthenticationClient extends SubClient {
  constructor() {
    super();
    this.endpoint = '/authentication';
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
    const response = await this.makeRequest('/login/', {
      method: 'POST',
      body: JSON.stringify(loginParams),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
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
    const body = Object.entries(registerUserParams).reduce(
      (prev, [key, value]) => ({
        ...prev,
        [FIELD_MAPPING.registerUser[key] || key]: value,
      }),
      {},
    );
    const response = await this.makeRequest('/registration/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  /**
   * @param {{key: string}} verifyEmailParams
   * @returns {Promise<{user: PartialUser}>}
   */
  async verifyEmail(verifyEmailParams) {
    const response = await this.makeRequest('/registration/verify-email/', {
      method: 'POST',
      body: JSON.stringify(verifyEmailParams),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  /**
   * @param {{email: User['email']}} sendVerificationEmailParams
   * @returns {Promise<{email: User['email']}>}
   */
  async sendVerificationEmail(sendVerificationEmailParams) {
    const response = await this.makeRequest('/send-email-verification/', {
      method: 'POST',
      body: JSON.stringify(sendVerificationEmailParams),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  /**
   * @param {{newPassword: string, newPasswordConfirm: string}} changePasswordParams
   * @returns {Promise<{new_password1: string, new_password2: string}>}
   */
  async changePassword(changePasswordParams) {
    const body = Object.entries(changePasswordParams).reduce(
      (prev, [key, value]) => ({
        ...prev,
        [FIELD_MAPPING.changePassword[key] || key]: value,
      }),
      {},
    );
    const response = await this.makeAuthenticatedRequest('/password/change/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
}
