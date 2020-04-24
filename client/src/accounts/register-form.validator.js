import store from '../store';

import { EMAIL_REGEX } from '../utils/form';

const validate = form => {
  const {
    app: {
      config: { passwordMinLength, passwordMaxLength }
    }
  } = store.getState();

  let errors = {};

  if (!form.email) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'Email address is invalid';
  }

  if (!form.password1) {
    errors.password1 = 'Password is required';
  } else if (!form.password2) {
    errors.password2 = 'Password confirmation is required';
  } else if (passwordMinLength && form.password1.length < passwordMinLength) {
    errors.password1 = `Password is too short (minimum ${passwordMinLength} characters)`;
  } else if (passwordMaxLength && form.password1.length > passwordMaxLength) {
    errors.password1 = `Password is too long (maximum ${passwordMaxLength} characters)`;
  } else if (form.password2 !== form.password1) {
    errors.password2 = 'Passwords do not match';
  }

  return errors;
};

export default validate;
