import store from '../store';

import { EMAIL_REGEX } from '../utils/form.js';

const validate = form => {
  const {
    app: {
      config: { passwordMinLength, passwordMaxLength },
    },
  } = store.getState();

  let errors = {};

  if (!form.email) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'Email address is invalid';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (passwordMinLength && form.password.length < passwordMinLength) {
    errors.password = `Password is too short (minimum ${passwordMinLength} characters)`;
  } else if (passwordMaxLength && form.password.length > passwordMaxLength) {
    errors.password = `Password is too long (maximum ${passwordMaxLength} characters)`;
  }

  return errors;
};

export default validate;
