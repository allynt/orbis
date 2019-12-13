import { EMAIL_REGEX } from '../utils/form.js';

const validate = form => {
  let errors = {};

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (form.email.length < 3) {
    errors.email = `Email ${form.email} is too short`;
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = `Email '${form.email}' is not well-formed`;
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 5) {
    errors.password = `Password ${form.password} is too short`;
  }

  return errors;
};

export default validate;
