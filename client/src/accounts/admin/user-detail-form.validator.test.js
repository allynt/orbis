import validate from './user-detail-form.validator';

fdescribe('User Detail Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        email: '', // Error, missing
        password: 'password',
      },
      {
        email: 'user@test.com',
        password: '', // Error, missing
      },
      {
        email: 'user@test.com',
        password: 'pass', // Error, too short
      },
      {
        email: '@test.com', // Error, missing username, prior to `@`
        password: 'password',
      },
      {
        email: 'usertest.com', // Error, missing `@`
        password: 'password',
      },
      {
        email: 'user@test', // Error, missing `.com|.net` etc
        password: 'password',
      },
    ];

    it.each(testFields)('Invalid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });
  });

  // describe('Success values', () => {
  //   const testFields = [
  //     {
  //       username: 'user',
  //       email: 'user@test.com',
  //       password: 'password'
  //     },
  //     {
  //       username: 'jon',
  //       email: 'user@test.com',
  //       password: 'password'
  //     },
  //     {
  //       username: 'user',
  //       email: 'user@test.com',
  //       password: 'paswd'
  //     },
  //     {
  //       username: 'user',
  //       email: 'a@b.c',
  //       password: 'password'
  //     }
  //   ];

  //   it.each(testFields)('Valid Value %o', form => {
  //     const errors = validate(form);
  //     expect(Object.keys(errors).length).not.toBeGreaterThan(0);
  //   });
  // });
});
