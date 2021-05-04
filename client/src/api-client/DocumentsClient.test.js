import { DocumentsClient } from './DocumentsClient';

describe('DocumentsClient', () => {
  /** @type {DocumentsClient} */
  let client;
  beforeEach(() => {
    client = new DocumentsClient();
  });

  it('Has a terms url', () => {
    expect(client.termsUrl).toContain('/api/documents/terms');
  });

  it('Has a privacy url', () => {
    expect(client.privacyUrl).toContain('/api/documents/privacy');
  });

  describe('userGuideUrl', () => {
    it('returns the general guide by default', () => {
      expect(client.userGuideUrl()).toContain(
        '/api/documents/guide?name=general',
      );
    });

    it('returns the name of the provided guide', () => {
      expect(client.userGuideUrl('analysis-toolbar')).toContain(
        '/api/documents/guide?name=analysis-toolbar',
      );
    });
  });
});
