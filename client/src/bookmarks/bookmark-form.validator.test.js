import validate from './bookmark-form.validator';

describe('Bookmark Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        title: '', // Error, missing
        description: ''
      },
      {
        title: 'id', // Error, too short
        description: 'description'
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
        title: 'Bookmark Title',
        description: ''
      },
      {
        title: 'gid',
        description: 'description'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
