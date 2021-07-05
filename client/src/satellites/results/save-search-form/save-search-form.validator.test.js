import validate from './save-search-form.validator';

describe('Satellite Search Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        name: 'ids', // Error, too short
      },
      {
        name: '', // Error, too short
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
        name: 'John',
      },
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
