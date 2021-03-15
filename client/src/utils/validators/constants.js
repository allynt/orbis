export const MESSAGES = {
  email: {
    required: 'Email address is required',
    email: 'Email address is invalid',
  },
  uniqueEmail: {
    notOneOf: 'A user with this email address already exists',
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
  name: {
    required: 'Name is required',
  },
  firstName: {
    required: 'First Name is required',
  },
  lastName: {
    required: 'Last Name is required',
  },
  acceptedTerms: {
    oneOF: 'You must accept the terms and conditions',
  },
  bookmarkTitle: {
    required: 'Title is required',
    notOneOf: 'There is already a map with this title',
  },
  customerName: {
    required: 'Customer name is required',
  },
  date: {
    matches: 'Please use the format DD/MM/YYYY',
    valid: 'Please enter a valid date',
    min: 'Date must not be before {{minDate}}',
    max: 'Date must not be after {{maxDate}}',
  },
};

export const CONTEXT_KEYS = {
  passwordMinLength: 'passwordMinLength',
  passwordMaxLength: 'passwordMaxLength',
  passwordStrength: 'passwordStrength',
  existingEmails: 'existingEmails',
  bookmarkTitles: 'bookmarkTitles',
  minDate: 'minDate',
  maxDate: 'maxDate',
};

export const FIELD_NAMES = {
  email: 'email',
  phone: 'phone',
  password: 'password',
  oldPassword: 'oldPassword',
  newPassword: 'newPassword',
  newPasswordConfirm: 'newPasswordConfirm',
  name: 'name',
  firstName: 'firstName',
  lastName: 'lastName',
  acceptedTerms: 'acceptedTerms',
  country: 'country',
  address: 'address',
  postcode: 'postcode',
  bookmarkTitle: 'title',
  bookmarkDescription: 'description',
  customerName: 'customerName',
  customerNameOfficial: 'customerNameOfficial',
  customerType: 'customerType',
  registeredNumber: 'registeredNumber',
  startDate: 'startDate',
  endDate: 'endDate',
};
