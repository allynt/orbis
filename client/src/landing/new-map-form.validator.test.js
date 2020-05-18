import validate from './new-map-form.validator';

describe('New Map Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        name: '', // Error, missing
        description: 'Description',
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
        name: 'New Map Name',
        description: 'Map Description',
      },
      {
        name: 'map',
        description: 'd',
      },
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
