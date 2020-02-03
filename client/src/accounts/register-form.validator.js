import store from '../store';

import { EMAIL_REGEX } from '../utils/form';

const validate = form => {
  const state = store.getState();
  const minLength = state.app.config.passwordMinLength;

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
  } else if (form.password1.length < minLength) {
    errors.password1 = `Password is too short (minimum ${minLength} characters)`;
  } else if (form.password2 !== form.password1) {
    errors.password2 = 'Passwords do not match';
  }

  return errors;
};

export default validate;
