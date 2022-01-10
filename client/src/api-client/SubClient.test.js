import { rest } from 'msw';
import { server } from 'mocks/server';

import { SubClient } from './SubClient';

describe('SubClient', () => {
  /** @type {SubClient} */
  let subClient;
  beforeEach(() => {
    subClient = new SubClient();
  });

  describe.each`
    member
    ${'userKey'}
    ${'apiHost'}
    ${'endpoint'}
  `('Class members: $member', ({ member }) => {
    it('gets and sets', () => {
      subClient[member] = 'test-value';
      expect(subClient[member]).toBe('test-value');
    });
  });

  describe('handleErrors', () => {
    it('Throws a response error is response is not ok', () => {
      expect(() => SubClient.handleErrors({ ok: false })).toThrow();
    });

    it("Returns response if it's ok", () => {
      expect(() => SubClient.handleErrors({ ok: true })).not.toThrow();
    });
  });

  describe('makeRequest', () => {
    it('Calls fetch with apiHost prepended to the provided url', async () => {
      server.use(
        rest.get('*/test/endpoint', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      subClient.apiHost = 'test-host.com';
      const response = await subClient.makeRequest('/test/endpoint');
      expect(response.ok).toBe(true);
    });

    it('Handles errors when response is not ok', () => {
      server.use(
        rest.get('*/api', (req, res, ctx) => {
          return res(ctx.status(401, 'Test Error'));
        }),
      );

      expect(subClient.makeRequest('/api')).rejects.toThrow();
    });
  });

  describe('makeAuthenticatedRequest', () => {
    it('Calls fetch with authentication header containing userKey', async () => {
      server.use(
        rest.delete('*/api', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const testOptions = {
        method: 'DELETE',
        headers: { Accept: 'everything' },
      };
      subClient.userKey = 'test-key-123';
      const response = await subClient.makeAuthenticatedRequest(
        '/api',
        testOptions,
      );
      expect(response.ok).toBe(true);
    });
  });

  describe.each`
    fn                                | method
    ${'makeAuthenticatedPostRequest'} | ${'POST'}
    ${'makePostRequest'}              | ${'POST'}
    ${'makeAuthenticatedPutRequest'}  | ${'PUT'}
  `('$fn', ({ fn, method }) => {
    const body = {
      id: 1,
      test: 'yes',
    };

    it('Calls fetch with json headers', async () => {
      server.use(
        rest.post('*/some/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
        rest.put('*/some/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const response = await subClient[fn]('/some/url', body);
      expect(response).toStrictEqual({});
    });

    it('Includes the stringified body', async () => {
      server.use(
        rest.post('*/some/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
        rest.put('*/some/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const response = await subClient[fn]('/some/url', body);
      expect(response).toStrictEqual({});
    });

    it('Returns the response body', () => {
      const response = { this: 'was returned' };
      server.use(
        rest.post('*/some/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(response));
        }),
        rest.put('*/some/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(response));
        }),
      );

      expect(subClient[fn]('/some/url', body)).resolves.toEqual(response);
    });
  });

  describe('mapParamsToApi', () => {
    it('Maps provided params to the api using the provided mappings', () => {
      subClient.fieldMapping = {
        test: {
          test1: 'testA',
          test2: 'testB',
        },
      };
      expect(
        subClient.mapParamsToApi({ test1: 'Hello', test2: 'World' }, 'test'),
      ).toEqual({ testA: 'Hello', testB: 'World' });
    });

    it("Uses the param key if an api key can't be found", () => {
      subClient.fieldMapping = {
        test: {
          test1: 'testA',
        },
      };
      expect(
        subClient.mapParamsToApi({ test1: 'Hello', test2: 'World' }, 'test'),
      ).toEqual({ testA: 'Hello', test2: 'World' });
    });
  });
});
