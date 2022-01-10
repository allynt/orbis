import * as yup from 'yup';

import { CONTEXT_KEYS, FIELD_NAMES, MESSAGES } from './constants';
import {
  email,
  uniqueEmail,
  password,
  oldPassword,
  newPassword,
  newPasswordConfirm,
  name,
  bookmarkTitle,
  firstName,
  lastName,
  acceptedTerms,
  customerName,
  date,
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

  describe('uniqueEmail', () => {
    const context = {
      [CONTEXT_KEYS.existingEmails]: ['test1@test.com', 'test2@test.com'],
    };

    it('happy path', async () => {
      await expect(
        uniqueEmail.validate('test3@test.com', { context }),
      ).resolves.toBe('test3@test.com');
    });

    it('is unique', async () => {
      await expect(
        uniqueEmail.validate('test1@test.com', { context }),
      ).rejects.toThrow(MESSAGES.uniqueEmail.notOneOf);
    });
  });

  describe('password', () => {
    const context = {
      [CONTEXT_KEYS.passwordMinLength]: 2,
      [CONTEXT_KEYS.passwordMaxLength]: 255,
      [CONTEXT_KEYS.passwordStrength]: 2,
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
          schema.validate(
            {
              oldPassword: 'absolutegarbagesecurity',
              newPassword: 'absolutegarbagesecurity',
              newPasswordConfirm: 'absolutegarbagesecurity',
            },
            { context },
          ),
        ).rejects.toThrow(MESSAGES.newPasswordConfirm.notOneOf);
      });
    });
  });

  describe('name', () => {
    it('happy path', async () => {
      await expect(name.validate('John Smith')).resolves.toBe('John Smith');
    });

    it('is required', async () => {
      await expect(name.validate('')).rejects.toThrow(MESSAGES.name.required);
    });
  });

  describe('firstName', () => {
    it('happy path', async () => {
      await expect(firstName.validate('John Smith')).resolves.toBe(
        'John Smith',
      );
    });

    it('is required', async () => {
      await expect(firstName.validate('')).rejects.toThrow(
        MESSAGES.firstName.required,
      );
    });
  });

  describe('lastName', () => {
    it('happy path', async () => {
      await expect(lastName.validate('John Smith')).resolves.toBe('John Smith');
    });

    it('is required', async () => {
      await expect(lastName.validate('')).rejects.toThrow(
        MESSAGES.lastName.required,
      );
    });
  });

  describe('acceptedTerms', () => {
    it('happy path', async () => {
      await expect(acceptedTerms.validate(true)).resolves.toBe(true);
    });

    it('must be true', async () => {
      await expect(acceptedTerms.validate(false)).rejects.toThrow(
        MESSAGES.acceptedTerms.oneOf,
      );
    });
  });

  describe('bookmarkTitle', () => {
    const context = {
      [CONTEXT_KEYS.bookmarkTitles]: ['test1', 'test2', 'test3'],
    };

    it('happy path', async () => {
      await expect(bookmarkTitle.validate('test4', { context })).resolves.toBe(
        'test4',
      );
    });

    it('is required', async () => {
      await expect(bookmarkTitle.validate('', { context })).rejects.toThrow(
        MESSAGES.bookmarkTitle.required,
      );
    });

    it('is unique', async () => {
      await expect(
        bookmarkTitle.validate('test1', { context }),
      ).rejects.toThrow(MESSAGES.bookmarkTitle.notOneOf);
    });
  });

  describe('customer name', () => {
    it('happy path', () => {
      expect(customerName.validate('Test Name')).resolves.toBe('Test Name');
    });

    it('is required', () => {
      expect(customerName.validate('')).rejects.toThrowError(
        MESSAGES.customerName.required,
      );
    });
  });

  describe('date', () => {
    describe('pattern', () => {
      it('allows empty strings', () => {
        expect(date.validate('')).resolves.toBe('');
      });

      it('Allows / separation', () => {
        expect(date.validate('1/1/2020')).resolves.toBe('1/1/2020');
      });

      it('Allows . separation', () => {
        expect(date.validate('1.1.2020')).resolves.toBe('1.1.2020');
      });

      it('Allows - separation', () => {
        expect(date.validate('1-1-2020')).resolves.toBe('1-1-2020');
      });

      it('Allows 2 digit years', () => {
        expect(date.validate('1/1/20')).resolves.toBe('1/1/20');
      });
    });

    describe('valid', () => {
      it('rejects invalid dates', () => {
        expect(date.validate('50/20/1234')).rejects.toThrowError(
          'Please enter a valid date',
        );
      });
    });

    describe('min', () => {
      const options = {
        context: {
          [CONTEXT_KEYS.minDate]: new Date(2020, 0, 1).toISOString(),
        },
      };
      it('Passes dates later than min', () => {
        expect(date.validateSync('1/2/2020', options)).toBe('1/2/2020');
      });

      it('Passes dates equal to min', () => {
        expect(date.validateSync('1/1/2020', options)).toBe('1/1/2020');
      });

      it('does not accept dates less than min', () => {
        expect(date.validate('31/12/2019', options)).rejects.toThrowError(
          'Date must not be before 01/01/2020',
        );
      });
    });

    describe('max', () => {
      const options = {
        context: {
          [CONTEXT_KEYS.maxDate]: new Date(2020, 11, 31).toISOString(),
        },
      };
      it('Does not accept dates greater than max', () => {
        expect(date.validate('24/10/2077', options)).rejects.toThrowError(
          'Date must not be after 31/12/2020',
        );
      });

      it('Allows dates equal to max', () => {
        expect(date.validate('31/12/2020', options)).resolves.toBe(
          '31/12/2020',
        );
      });

      it('Allows dates less than max', () => {
        expect(date.validate('30/12/2020', options)).resolves.toBe(
          '30/12/2020',
        );
      });
    });
  });
});
