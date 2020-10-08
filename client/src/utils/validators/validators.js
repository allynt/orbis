import * as yup from 'yup';
import zxcvbn from 'zxcvbn';
import { MESSAGES, CONTEXT_KEYS, FIELD_NAMES } from './constants';

export const email = yup
  .string()
  .required(MESSAGES.email.required)
  .email(MESSAGES.email.email);

export const password = yup
  .string()
  .required(MESSAGES.password.required)
  .min(yup.ref(`$${CONTEXT_KEYS.passwordMinLength}`), MESSAGES.password.min)
  .max(yup.ref(`$${CONTEXT_KEYS.passwordMaxLength}`), MESSAGES.password.max);

export const oldPassword = yup.string().required(MESSAGES.oldPassword.required);

export const newPassword = yup
  .string()
  .concat(password)
  .test({
    test: function (value) {
      const { score } = zxcvbn(value);
      // @ts-ignore
      return score > this.options.context?.[CONTEXT_KEYS.passwordMinStrength];
    },
    message: MESSAGES.newPassword.strength,
  });

export const newPasswordConfirm = yup
  .string()
  .concat(password)
  .oneOf([yup.ref(FIELD_NAMES.newPassword)], MESSAGES.newPasswordConfirm.oneOf)
  .when(FIELD_NAMES.oldPassword, (oldPassword, schema) =>
    schema.notOneOf([oldPassword], MESSAGES.newPasswordConfirm.notOneOf),
  );
