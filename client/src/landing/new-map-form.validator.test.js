import validate from './new-map-form.validator';

describe('New Map Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        name: '', // Error, missing
        description: 'Description',
      },
      {
        name: 'id', // Error, too short
        description: 'password',
      },
      {
        name: 'New Map Name',
        description: '', // Error, missing
      },
      {
        name: 'New Map Name',
        description: 'desc', // Error, too short
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
        description: 'descr',
      },
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
