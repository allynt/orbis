import store from '../store';

const validate = form => {
  const {
    app: {
      config: { passwordMinLength, passwordMaxLength },
    },
  } = store.getState();

  const data = JSON.parse(JSON.stringify(form).replace(/"\s+|\s+"/g, '"'));
  console.log('DATA: ', data);
  let errors = {};

  if (!data.new_password1) {
    errors.new_password1 = 'New Password is required';
  } else if (
    passwordMinLength &&
    data.new_password1.length < passwordMinLength
  ) {
    errors.new_password1 = `Password is too short (minimum ${passwordMinLength} characters)`;
  } else if (
    passwordMaxLength &&
    data.new_password1.length > passwordMaxLength
  ) {
    errors.new_password1 = `Password is too long (maximum ${passwordMaxLength} characters)`;
  }

  if (!data.new_password2) {
    errors.new_password2 = 'New Password is required';
  } else if (data.new_password2 !== data.new_password1) {
    errors.new_password2 = `Passwords don't match`;
  }

  return errors;
};

export default validate;
