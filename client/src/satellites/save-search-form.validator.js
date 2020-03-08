const validate = form => {
  let errors = {};

  if (!form.title) {
    errors.title = 'Title is required';
  }

  return errors;
};

export default validate;
