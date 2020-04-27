import validate from './bookmark-form.validator';

describe('Bookmark Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        title: '', // Error, missing
        description: 'description',
      },
      {
        title: 'id', // Error, too short
        description: 'description',
      },
      {
        title: 'Bookmark Title',
        description: '', // Error, missing
      },
      {
        title: 'Bookmark Title',
        description: 'de', // Error, too short
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
        title: 'Bookmark Title',
        description: 'description',
      },
      {
        title: 'gid',
        description: 'des',
      },
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
