const validate = form => {
  let errors = {};

  if (!form.title) {
    errors.title = 'Title is required';
  } else if (form.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!form.description) {
    errors.description = 'Description is required';
  } else if (form.description.length < 3) {
    errors.description = 'Description must be at least 3 characters';
  }

  return errors;
};

export default validate;
