import validate from './login-form.validator';

describe('Login Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        email: 'user@domain.com',
        password: '' // Error, missing
      },
      {
        email: 'us', // Error, too short
        password: 'password'
      },
      {
        email: 'user@domain.com',
        password: 'pass' // Error, too short
      }
    ];

    it.each(testFields)('Invalid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });
  });

  describe('Success values', () => {
    const testFields = [
      {
        email: 'user@domain.com',
        password: 'password'
      },
      {
        email: 'user@domain.com',
        password: 'paswd'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
