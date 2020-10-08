import * as yup from 'yup';
import { CONTEXT_KEYS, FIELD_NAMES, MESSAGES } from './constants';
import {
  email,
  password,
  oldPassword,
  newPassword,
  newPasswordConfirm,
} from './validators';

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
      [CONTEXT_KEYS.passwordMinLength]: 2,
      [CONTEXT_KEYS.passwordMaxLength]: 255,
      [CONTEXT_KEYS.passwordMinStrength]: 1,
    };

    it('happy path', async () => {
      await expect(
        password.validate('pandaconcretespoon', { context }),
      ).resolves.toBe('pandaconcretespoon');
    });

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
      it('happy path', async () => {
        await expect(
          newPassword.validate('pandaconcretespoon', {
            context,
          }),
        ).resolves.toBe('pandaconcretespoon');
      });

      it('is equal or greater to the minimum strength', async () => {
        await expect(
          newPassword.validate('panda', { context }),
        ).rejects.toThrow(MESSAGES.newPassword.strength);
      });
    });

    describe('newPasswordConfirm', () => {
      it('happy path', async () => {
        const values = {
          oldPassword: 'absolutegarbagesecurity',
          newPassword: 'pandaconcretespoon',
          newPasswordConfirm: 'pandaconcretespoon',
        };
        const schema = yup.object({
          oldPassword,
          newPassword,
          newPasswordConfirm,
        });
        await expect(schema.validate(values, { context })).resolves.toEqual(
          values,
        );
      });

      it('must match newPassword', async () => {
        const schema = yup.object({
          [FIELD_NAMES.newPassword]: yup.string(),
          [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
        });
        await expect(
          schema.validate(
            {
              newPassword: 'pandaconcretespoon',
              newPasswordConfirm: 'pandaconcretespoo',
            },
            { context },
          ),
        ).rejects.toThrow(MESSAGES.newPasswordConfirm.oneOf);
      });

      it('must not equal oldPassword', async () => {
        const schema = yup.object({
          [FIELD_NAMES.oldPassword]: yup.string(),
          [FIELD_NAMES.newPassword]: yup.string(),
          [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
        });
        await expect(
          schema.validate({
            oldPassword: 'absolutegarbagesecurity',
            newPassword: 'absolutegarbagesecurity',
            newPasswordConfirm: 'absolutegarbagesecurity',
          }),
        ).rejects.toThrow(MESSAGES.newPasswordConfirm.notOneOf);
      });
    });
  });
});
