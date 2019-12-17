import { EMAIL_REGEX } from '../utils/form';

const validate = form => {
  let errors = {};

  if (!form.email) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = `Email address ${form.email} is invalid`;
  }

  return errors;
};

export default validate;
