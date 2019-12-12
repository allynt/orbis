const validate = form => {
  let errors = {};

  const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (form.email.length < 3) {
    errors.email = `Email ${form.email} is too short`;
  } else if (!email_regex.test(form.email)) {
    errors.email = `Email '${form.email}' is not well-formed`;
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 5) {
    errors.password = `Password ${form.password} is too short`;
  }

  return errors;
};

export default validate;
