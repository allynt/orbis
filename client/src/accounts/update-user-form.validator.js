const validate = form => {
  let errors = {};

  if (form.first_name) {
    if (form.first_name.length < 2) {
      errors.first_name = `First name ${form.first_name} is too short`;
    }
  }

  if (form.last_name) {
    if (form.last_name.length < 2) {
      errors.last_name = `Last name ${form.last_name} is too short`;
    }
  }

  return errors;
};

export default validate;
