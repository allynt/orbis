import { SubClient } from './SubClient';

export class DocumentsClient extends SubClient {
  constructor() {
    super('/documents');
  }

  get termsUrl() {
    return `${this.apiHost}/api${this.endpoint}/terms/`;
  }

  get privacyUrl() {
    return `${this.apiHost}/api${this.endpoint}/privacy/`;
  }

  /**
   * @param {'general' | 'analysis-toolbar'} guideName
   */
  userGuideUrl(guideName = 'general') {
    return `${this.apiHost}/api${this.endpoint}/guide?name=${guideName}`;
  }
}
