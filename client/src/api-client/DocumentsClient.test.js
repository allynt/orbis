import { rest } from 'msw';

import { server } from 'mocks/server';

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

  it('Has a named terms url', () => {
    expect(client.getTermsUrl('user_terms')).toContain(
      '/api/documents/?type=TERMS&has_orb=false&name=user_terms',
    );
  });

  it('Has a privacy url', () => {
    expect(client.privacyUrl).toContain(
      '/api/documents/?type=PRIVACY&has_orb=false',
    );
  });

  it('Has a named privacy url', () => {
    expect(client.getPrivacyUrl('general_privacy')).toContain(
      '/api/documents/?type=PRIVACY&has_orb=false&name=general_privacy',
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

    it('Returns saved documents from response', async () => {
      const docs = [{ id: 1 }, { id: 2 }];

      server.use(
        rest.get('*/api/documents/agreements/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(docs));
        }),
      );

      const responseSources = await client.getAgreedDocuments();

      expect(responseSources).toEqual(docs);
    });
  });
});
