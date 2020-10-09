import validate from './register-form.validator';

describe('Register Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        // Error, missing `email`
        password1: 'password',
        password2: 'password',
      },
      {
        email: '', // Error, missing value
        password1: 'password',
        password2: 'password',
      },
      {
        email: ' ', // Error, missing value
        password1: 'password',
        password2: 'password',
      },
      {
        email: 'testuser:test.com', // Error, malformed email
        password1: 'password',
        password2: 'password',
      },
      {
        email: 'testuser@testcom', // Error, malformed email
        password1: 'password',
        password2: 'password',
      },
    ];

    it.each(testFields)('Invalid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });
  });

  describe('Success values', () => {
    const testFields = [
      {
        email: 'testuser@test.com',
        password1: 'password',
        password2: 'password',
      },
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
