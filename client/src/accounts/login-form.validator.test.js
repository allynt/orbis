import validate from './login-form.validator';

describe('Login Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        username: 'user',
        password: '' // Error, missing
      },
      {
        username: 'su', // Error, too short
        password: 'password'
      },
      {
        username: 'user',
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
        username: 'user',
        password: 'password'
      },
      {
        username: 'user',
        password: 'paswd'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
