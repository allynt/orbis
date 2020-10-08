import { MESSAGES } from './constants';
import { email, password, oldPassword, newPassword } from './validators';

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

    describe('is a valid email', () => {
      it('missing @ and .', async () => {
        await expect(email.validate('testtestcom')).rejects.toThrow(
          MESSAGES.email.email,
        );
      });

      it('missing @', async () => {
        await expect(email.validate('testtest.com')).rejects.toThrow(
          MESSAGES.email.email,
        );
      });

      it('missing .', async () => {
        await expect(email.validate('test@testcom')).rejects.toThrow(
          MESSAGES.email.email,
        );
      });
    });
  });

  describe('password', () => {
    const context = {
      passwordMinLength: 2,
      passwordMaxLength: 255,
      passwordMinStrength: 1,
    };
    it('is required', async () => {
      await expect(password.validate('')).rejects.toThrow(
        MESSAGES.password.required,
      );
    });

    it('is greater than min length provided', async () => {
      await expect(password.validate('a', { context })).rejects.toThrow(
        MESSAGES.password.min.replace(
          '${min}',
          context.passwordMinLength.toString(),
        ),
      );
    });

    it('is less than max length provided', async () => {
      const longPassword = new Array(context.passwordMaxLength + 1)
        .fill('a')
        .join('');
      await expect(
        password.validate(longPassword, { context }),
      ).rejects.toThrow(
        MESSAGES.password.max.replace(
          '${max}',
          context.passwordMaxLength.toString(),
        ),
      );
    });

    describe('oldPassword', () => {
      it('is required', async () => {
        await expect(oldPassword.validate('')).rejects.toThrow(
          MESSAGES.oldPassword.required,
        );
      });
    });

    describe('newPassword', () => {
      it('is equal or greater to the minimum strength', async () => {
        await expect(
          newPassword.validate('panda', { context }),
        ).rejects.toThrow(MESSAGES.newPassword.strength);
      });
    });
  });
});
