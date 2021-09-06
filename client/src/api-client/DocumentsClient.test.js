import { DocumentsClient } from './DocumentsClient';

describe('DocumentsClient', () => {
  /** @type {DocumentsClient} */
  let client;
  beforeEach(() => {
    client = new DocumentsClient();
  });

  it('Has a terms url', () => {
    expect(client.termsUrl).toContain(
      '/api/documents/?type=TERMS&has_orb=false',
    );
  });

  it('Has a privacy url', () => {
    expect(client.privacyUrl).toContain(
      '/api/documents/?type=PRIVACY&has_orb=false',
    );
  });

  describe('userGuideUrl', () => {
    it('returns the general guide by default', () => {
      expect(client.userGuideUrl()).toContain(
        '/api/documents/?type=GUIDE&has_orb=false&name=general',
      );
    });

    it('returns the name of the provided guide', () => {
      expect(client.userGuideUrl('analysis-toolbar')).toContain(
        '/api/documents/?type=GUIDE&has_orb=false&name=analysis-toolbar',
      );
    });
  });
});
