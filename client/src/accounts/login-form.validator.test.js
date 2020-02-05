import validate from './login-form.validator';

describe('Login Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        email: 'test@test.com',
        password: '' // Error, missing
      },
      {
        email: 'testtest.com', // Error, missing `@`
        password: 'password'
      },
      {
        email: '@test.com', // Error, missing email part
        password: 'password'
      },
      {
        email: 'test@testcom', // Error, missing `.` part
        password: 'password'
      },
      {
        email: 'test@test.', // Error, missing `.` part
        password: 'password'
      },
      {
        email: 'user',
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
        email: 'test@test.com',
        password: 'password'
      },
      {
        email: 'test@test.com',
        password: 'pasword'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
