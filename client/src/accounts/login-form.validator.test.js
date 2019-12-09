import validate from './login-form.validator';

describe('Login Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        username: 'test@test.com',
        password: '' // Error, missing
      },
      {
        username: 'testtest.com', // Error, missing `@`
        password: 'password'
      },
      {
        username: '@test.com', // Error, missing username part
        password: 'password'
      },
      {
        username: 'test@testcom', // Error, missing `.` part
        password: 'password'
      },
      {
        username: 'test@test.', // Error, missing `.` part
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
        username: 'test@test.com',
        password: 'password'
      },
      {
        username: 'test@test.com',
        password: 'paswd'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
