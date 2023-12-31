import { SubClient } from './SubClient';

export class DocumentsClient extends SubClient {
  constructor() {
    super('/documents');
  }

  getTermsUrl(name = '') {
    return `${this.apiHost}/api${this.endpoint}/?type=TERMS&has_orb=false${
      name ? `&name=${name}` : ''
    }`;
  }

  get termsUrl() {
    return this.getTermsUrl();
  }

  getPrivacyUrl(name = '') {
    return `${this.apiHost}/api${this.endpoint}/?type=PRIVACY&has_orb=false${
      name ? `&name=${name}` : ''
    }`;
  }

  get privacyUrl() {
    return this.getPrivacyUrl();
  }

  /**
   * @param {'general' | 'analysis-toolbar' | 'cross-filtering'} guideName
   */
  userGuideUrl(guideName = 'general') {
    return `${this.apiHost}/api${this.endpoint}/?type=GUIDE&has_orb=false&name=${guideName}`;
  }

  async getAgreedDocuments() {
    const response = await this.makeAuthenticatedRequest('/agreements/');
    return response.json();
  }
}
