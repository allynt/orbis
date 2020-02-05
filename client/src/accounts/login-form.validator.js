import { EMAIL_REGEX } from '../utils/form.js';

const validate = form => {
  let errors = {};

  if (!form.email) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'Email address is invalid';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export default validate;
