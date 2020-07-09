import {
  createUserFormValidator,
  ERROR_MESSAGES,
} from './create-user-form.validator';

describe('createUserFormValidator', () => {
  describe('email', () => {
    it('is required', () => {
      const values = { email: '' };
      const expectedErrors = { email: ERROR_MESSAGES.email.required };
      const result = createUserFormValidator(values, {});
      expect(result.errors).toEqual(expectedErrors);
    });

    it('must be a valid email address', () => {
      const values = { email: 'hello' };
      const expectedErrors = { email: ERROR_MESSAGES.email.invalid };
      const result = createUserFormValidator(values, {});
      expect(result.errors).toEqual(expectedErrors);
    });

    it('must be unique', () => {
      const existingEmails = [
        'test@test.com',
        'test1@test.com',
        'test2@test.com',
      ];
      const values = { email: 'test1@test.com' };
      const expectedErrors = {
        email: ERROR_MESSAGES.email.exists(values.email),
      };
      const result = createUserFormValidator(values, { existingEmails });
      expect(result.errors).toEqual(expectedErrors);
    });
  });
});
