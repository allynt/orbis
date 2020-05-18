const validate = form => {
  let errors = {};

  if (!form.name) {
    errors.name = 'Name is required';
  }

  if (!form.description) {
    errors.description = 'Description is required';
  }

  return errors;
};

export default validate;
