import { EMAIL_REGEX } from '../../../utils/form.js';

const validate = form => {
  let errors = {};

  if (!form.email) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'Email address is invalid';
  }

  return errors;
};

export default validate;
