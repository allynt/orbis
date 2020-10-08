export const MESSAGES = {
  email: {
    required: 'Email address is required',
    email: 'Email address is invalid',
  },
  password: {
    required: 'Password is required',
    min: 'Password is too short (minimum ${min} characters)',
    max: 'Password is too long (maximum ${max} characters)',
  },
  oldPassword: {
    required: 'Old Password is required',
  },
  newPassword: {
    strength: 'Password must not be weak',
  },
  newPasswordConfirm: {
    oneOf: "Passwords don't match",
    notOneOf: 'New Password matches Old Password',
  },
};

export const CONTEXT_KEYS = {
  passwordMinLength: 'passwordMinLength',
  passwordMaxLength: 'passwordMaxLength',
  passwordStrength: 'passwordStrength',
};

export const FIELD_NAMES = {
  email: 'email',
  password: 'password',
  oldPassword: 'oldPassword',
  newPassword: 'newPassword',
  newPasswordConfirm: 'newPasswordConfirm',
};
