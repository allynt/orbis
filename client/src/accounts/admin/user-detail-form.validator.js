import { EMAIL_REGEX } from '../../utils/form';

const validate = form => {
  let errors = {};

  if (!form.email) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = `Email address ${form.email} is invalid`;
  }

  if (!form.password1) {
    errors.password1 = 'Password is required';
  } else if (!form.password2) {
    errors.password2 = 'Password is required';
  } else if (form.password1.length < 5) {
    errors.password1 = `Password ${form.password1} is too short`;
  } else if (form.password2.length < 5) {
    errors.password2 = `Password ${form.password2} is too short`;
  } else if (form.password2 !== form.password1) {
    errors.password2 = `Password ${form.password1} doesn't match ${form.password2}`;
  }

  return errors;
};

export default validate;
