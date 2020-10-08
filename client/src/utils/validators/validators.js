import * as yup from 'yup';
import zxcvbn from 'zxcvbn';
import { MESSAGES } from './constants';

export const email = yup
  .string()
  .required(MESSAGES.email.required)
  .email(MESSAGES.email.email);

export const password = yup
  .string()
  .required(MESSAGES.password.required)
  .min(yup.ref('$passwordMinLength'), MESSAGES.password.min)
  .max(yup.ref('$passwordMaxLength'), MESSAGES.password.max);

export const oldPassword = yup.string().required(MESSAGES.oldPassword.required);

export const newPassword = yup
  .string()
  .concat(password)
  .test({
    name: 'strength',
    test: function (value) {
      const { score } = zxcvbn(value);
      // @ts-ignore
      return score > this.options.context?.passwordMinStrength;
    },
    message: MESSAGES.newPassword.strength,
  });

export const newPasswordConfirm = { validate: () => null };
