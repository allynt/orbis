import fetch from 'jest-fetch-mock';

import { SubClient } from './SubClient';

fetch.enableMocks();

describe('SubClient', () => {
  /** @type {SubClient} */
  let subClient;
  beforeEach(() => {
    fetch.resetMocks();
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
    it('Calls fetch with apiHost prepended to the provided url', () => {
      subClient.apiHost = 'test-host.com';
      subClient.makeRequest('/test/endpoint');
      expect(fetch).toBeCalledWith(
        'test-host.com/api/test/endpoint',
        expect.anything(),
      );
    });

    it('Handles errors when response is not ok', () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message',
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );
      expect(subClient.makeRequest('/api')).rejects.toThrow();
    });
  });

  describe('makeAuthenticatedRequest', () => {
    it('Calls fetch with authentication header containing userKey', () => {
      const testOptions = {
        method: 'DELETE',
        headers: { Accept: 'everything' },
      };
      subClient.userKey = 'test-key-123';
      subClient.makeAuthenticatedRequest(null, testOptions);
      expect(fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...testOptions,
          headers: {
            ...testOptions.headers,
            Authorization: 'Token test-key-123',
          },
        }),
      );
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

    it('Calls fetch with json headers', () => {
      fetch.once(JSON.stringify({}));
      subClient[fn]('/some/url', body);
      expect(fetch).toBeCalledWith(
        expect.stringContaining('/some/url'),
        expect.objectContaining({
          method,
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('Includes the stringified body', () => {
      fetch.once(JSON.stringify({}));
      subClient[fn]('/some/url', body);
      expect(fetch).toBeCalledWith(
        expect.stringContaining('/some/url'),
        expect.objectContaining({
          body: JSON.stringify(body),
        }),
      );
    });

    it('Returns the response body', () => {
      const response = { this: 'was returned' };
      fetch.once(JSON.stringify(response));
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
