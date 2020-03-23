const validate = form => {
  let errors = {};

  if (!form.title) {
    errors.title = 'Title is required';
  } else if (form.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  return errors;
};

export default validate;
