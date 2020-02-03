import { EMAIL_REGEX } from '../utils/form.js';

const minLength = 5;

const validate = form => {
  let errors = {};

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'Email is invalid';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export default validate;
