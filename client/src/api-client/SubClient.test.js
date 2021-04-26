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
    it('gets and sets', () => {
      const subClient = new SubClient();
      subClient.apiHost = 'http://test-host.com';
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
