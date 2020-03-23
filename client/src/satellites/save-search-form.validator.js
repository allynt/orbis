const validate = form => {
  let errors = {};

  if (!form.name) {
    errors.name = 'Name is required';
  }

  if (form.name.length <= 3) {
    errors.name = 'Name field must exceed 3 characters';
  }

  return errors;
};

export default validate;
