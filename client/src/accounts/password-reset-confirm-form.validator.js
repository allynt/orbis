import zxcvbn from 'zxcvbn';

import store from '../store';

const validate = form => {
  const {
    app: {
      config: { passwordMinLength, passwordMaxLength, passwordStrength },
    },
  } = store.getState();

  let errors = {};

  if (!form.new_password1) {
    errors.new_password1 = 'New Password is required';
  } else if (
    passwordMinLength &&
    form.new_password1?.length < passwordMinLength
  ) {
    errors.new_password1 = `Password is too short (minimum ${passwordMinLength} characters)`;
  } else if (
    passwordMaxLength &&
    form.new_password1?.length > passwordMaxLength
  ) {
    errors.new_password1 = `Password is too long (maximum ${passwordMaxLength} characters)`;
  } else {
    const passwordStrengthResponse = zxcvbn(form.new_password1);

    if (passwordStrengthResponse.score < passwordStrength) {
      errors.new_password1 = 'Password must not be weak”';
    }
  }

  if (!form.new_password2) {
    errors.new_password2 = 'New Password is required';
  } else if (form.new_password2 !== form.new_password1) {
    errors.new_password2 = `Passwords don't match`;
  }

  return errors;
};

export default validate;
