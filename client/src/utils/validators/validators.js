import * as yup from 'yup';
import { MESSAGES } from './constants';

export const email = yup
  .string()
  .required(MESSAGES.email.required)
  .email(MESSAGES.email.email);

export const password = yup
  .string()
  .required(MESSAGES.password.required)
  .min(yup.ref('$minLength'), MESSAGES.password.min)
  .max(yup.ref('$maxLength'), MESSAGES.password.max);

export const oldPassword = () => null;
export const newPassword = () => null;
export const newPasswordConfirm = () => null;
