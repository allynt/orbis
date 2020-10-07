import * as yup from 'yup';
import { MESSAGES } from './constants';

export const email = yup
  .string()
  .required(MESSAGES.email.required)
  .email(MESSAGES.email.email);

export const password = () => null;
export const oldPassword = () => null;
export const newPassword = () => null;
export const newPasswordConfirm = () => null;
