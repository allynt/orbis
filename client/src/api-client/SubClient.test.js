import { SubClient } from './SubClient';

describe('SubClient', () => {
  describe('userKey', () => {
    it('gets and sets', () => {
      const subClient = new SubClient();
      subClient.userKey = 'user-key-123';
      expect(subClient.userKey).toBe('user-key-123');
    });
  });

  describe('apiHost', () => {
    it('is set to process.env.REACT_APP_API_HOST if env is development', () => {
      // @ts-ignore
      process.env.NODE_ENV = 'development';
      process.env.REACT_APP_API_HOST = 'http://test-host.com';
      const subClient = new SubClient();
      expect(subClient.apiHost).toBe('http://test-host.com');
    });

    it('is set to window?._env_?.REACT_APP_API_HOST if env is not development', () => {
      // @ts-ignore
      process.env.NODE_ENV = 'something else';
      window._env_ = { REACT_APP_API_HOST: 'http://test-host.com' };
      const subClient = new SubClient();
      expect(subClient.apiHost).toBe('http://test-host.com');
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
});
