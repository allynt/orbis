import { EMAIL_REGEX } from 'utils/form';

export const ERROR_MESSAGES = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
    exists: email => `User with email ${email} already exists`,
  },
};

/**
 * @param {string[]} existingEmails
 * @param {{name: string, email: string, licences: string[]}} values
 */
export const createUserFormValidator = (values, { existingEmails }) => {
  let errors = {};
  if (values.email === undefined || values.email === null || values.email === '')
    errors.email = ERROR_MESSAGES.email.required;
  if (!!values.email && !EMAIL_REGEX.test(values.email)) errors.email = ERROR_MESSAGES.email.invalid;
  if (existingEmails?.find(email => email === values.email)) errors.email = ERROR_MESSAGES.email.exists(values.email);
  return { errors, values };
};
