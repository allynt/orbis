import validate from './satellite-search-form.validator';

describe('Satellite Search Form Validator', () => {
  xdescribe('Failure values', () => {
    // FIXME: Change `testFields` to failure values for the search form
    const testFields = [
      {
        first_name: 'J', // Error, too short
        last_name: 'Smith'
      },
      {
        first_name: 'James',
        last_name: 'S' // Error, too short
      }
    ];

    it.each(testFields)('Invalid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });
  });

  xdescribe('Success values', () => {
    // FIXME: Change `testFields` to failure values for the search form
    const testFields = [
      {
        first_name: 'Su',
        last_name: 'Smith'
      },
      {
        first_name: 'John',
        last_name: 'Smith'
      },
      {
        first_name: '',
        last_name: 'Smith'
      },
      {
        first_name: 'John',
        last_name: ''
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
