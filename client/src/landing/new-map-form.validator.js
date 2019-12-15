const validate = form => {
  let errors = {};

  if (!form.name) {
    errors.name = 'Name is required';
  } else if (form.name.length < 3) {
    errors.name = `Name ${form.name} is too short`;
  }

  if (!form.description) {
    errors.description = 'Description is required';
  } else if (form.description.length < 5) {
    errors.description = `Description ${form.description} is too short`;
  }

  return errors;
};

export default validate;
