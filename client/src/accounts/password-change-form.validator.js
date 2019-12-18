const validate = form => {
  let errors = {};

  if (!form.old_password) {
    errors.old_password = 'Old Password is required';
  } else if (form.old_password.length < 5) {
    errors.old_password = `Old Password ${form.old_password} is too short`;
  } else if (!form.new_password1) {
    errors.new_password1 = 'New Password is required';
  } else if (form.new_password1.length < 5) {
    errors.new_password1 = `New Password ${form.new_password1} is too short`;
  } else if (!form.new_password2) {
    errors.new_password2 = 'New Password is required';
  } else if (form.new_password2.length < 5) {
    errors.new_password2 = `New Password ${form.new_password2} is too short`;
  } else if (form.new_password2 !== form.new_password1) {
    errors.new_password2 = `Password ${form.new_password1} doesn't match ${form.new_password2}`;
  } else if (form.new_password2 === form.old_password) {
    errors.new_password2 = `New Passwords ${form.new_password2} match ${form.old_password}`;
  }

  return errors;
};

export default validate;
