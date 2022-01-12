// Routes
export const REGISTER = '/register';
export const REGISTER_CUSTOMER = `${REGISTER}/customer`;
export const REGISTER_CUSTOMER_USER = `${REGISTER_CUSTOMER}/user`;
export const REGISTER_CUSTOMER_ORDER = `${REGISTER_CUSTOMER}/order`;
export const RESEND = '/resend';
export const CONFIRM_EMAIL = '/confirm-email/:key';
export const LOGIN = '/login';
export const PASSWORD_RESET_REQUEST = '/password/reset';
export const PASSWORD_RESET = '/password/reset/:token/:uid/';
export const PASSWORD_CHANGE = '/password/change';

// URLS
const ACCOUNTS_PREFIX = '/accounts';
export const LOGIN_URL = `${ACCOUNTS_PREFIX}${LOGIN}`;
export const RESEND_URL = `${ACCOUNTS_PREFIX}${RESEND}`;
export const REGISTER_URL = `${ACCOUNTS_PREFIX}${REGISTER}`;
export const REGISTER_CUSTOMER_USER_URL = `${ACCOUNTS_PREFIX}${REGISTER_CUSTOMER_USER}`;
export const PASSWORD_RESET_REQUEST_URL = `${ACCOUNTS_PREFIX}${PASSWORD_RESET_REQUEST}`;
