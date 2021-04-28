import fetch from 'jest-fetch-mock';

import { SubClient } from './SubClient';

describe('SubClient', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe.each`
    member
    ${'userKey'}
    ${'apiHost'}
    ${'endpoint'}
  `('Class members: $member', ({ member }) => {
    it('gets and sets', () => {
      const subClient = new SubClient();
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
      const client = new SubClient();
      client.apiHost = 'test-host.com';
      client.makeRequest('/test/endpoint');
      expect(fetch).toBeCalledWith(
        'test-host.com/api/test/endpoint',
        expect.anything(),
      );
    });

    it('Handles errors when response is not ok', async () => {
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
      const client = new SubClient();
      await expect(client.makeRequest('/api')).rejects.toThrow();
    });
  });

  describe('makeAuthenticatedRequest', () => {
    it('Calls fetch with authentication header containing userKey', async () => {
      const testOptions = {
        method: 'DELETE',
        headers: { Accept: 'everything' },
      };
      const client = new SubClient();
      client.userKey = 'test-key-123';
      client.makeAuthenticatedRequest(null, testOptions);
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

  describe('mapParamsToApi', () => {
    it('Maps provided params to the api using the provided mappings', () => {
      const client = new SubClient();
      client.fieldMapping = {
        test: {
          test1: 'testA',
          test2: 'testB',
        },
      };
      expect(
        client.mapParamsToApi({ test1: 'Hello', test2: 'World' }, 'test'),
      ).toEqual({ testA: 'Hello', testB: 'World' });
    });

    it("Uses the param key if an api key can't be found", () => {
      const client = new SubClient();
      client.fieldMapping = {
        test: {
          test1: 'testA',
        },
      };
      expect(
        client.mapParamsToApi({ test1: 'Hello', test2: 'World' }, 'test'),
      ).toEqual({ testA: 'Hello', test2: 'World' });
    });
  });
});
