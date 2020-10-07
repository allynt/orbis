import { MESSAGES } from './constants';
import { email } from './validators';

describe('field validators', () => {
  describe('email', () => {
    it('happy path', async () => {
      await expect(email.validate('test@test.com')).resolves.toBe(
        'test@test.com',
      );
    });
    it('is required', async () => {
      await expect(email.validate('')).rejects.toThrow(MESSAGES.email.required);
    });

    it('is a valid email', async () => {
      await expect(email.validate('testtestcom')).rejects.toThrow(
        MESSAGES.email.email,
      );
    });
  });
});
