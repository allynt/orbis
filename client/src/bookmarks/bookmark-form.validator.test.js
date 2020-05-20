import validate from './bookmark-form.validator';

describe('Bookmark Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        title: '', // Error, missing
        description: 'description',
      },
    ];

    const titles = ['title 1', 'title 2', 'title 3'];

    it.each(testFields)('Invalid Value %o', form => {
      const validateCallback = validate(titles);
      const errors = validateCallback(form);
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
