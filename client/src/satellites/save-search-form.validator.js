const validate = form => {
  let errors = {};

  if (!form.name) {
    errors.name = 'Name is required';
  }

  return errors;
};

export default validate;
