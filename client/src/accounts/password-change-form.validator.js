import store from '../store';

const validate = form => {
  const {
    app: {
      config: { passwordMinLength, passwordMaxLength },
    },
  } = store.getState();

  let errors = {};

  if (!form.old_password) {
    errors.old_password = 'Old Password is required';
  } else if (!form.new_password1) {
    errors.new_password1 = 'New Password is required';
  } else if (
    passwordMinLength &&
    form.new_password1?.trim().length < passwordMinLength
  ) {
    errors.new_password1 = `Password is too short (minimum ${passwordMinLength} characters)`;
  } else if (
    passwordMaxLength &&
    form.new_password1?.trim().length > passwordMaxLength
  ) {
    errors.new_password1 = `Password is too long (maximum ${passwordMaxLength} characters)`;
  }

  if (!form.new_password2) {
    errors.new_password2 = 'New Password is required';
  } else if (form.new_password2?.trim() !== form.new_password1?.trim()) {
    errors.new_password2 = "Passwords don't match";
  } else if (form.new_password2?.trim() === form.old_password?.trim()) {
    errors.new_password2 = `New Password matches Old Password`;
  }

  return errors;
};

export default validate;
