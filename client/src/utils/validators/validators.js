import { compareAsc, compareDesc, format } from 'date-fns';
import { dateStringToDate, DATE_SEPARATOR, isValid, toDMY } from 'utils/dates';
import * as yup from 'yup';
import zxcvbn from 'zxcvbn';
import { MESSAGES, CONTEXT_KEYS, FIELD_NAMES } from './constants';

export const email = yup
  .string()
  .required(MESSAGES.email.required)
  .email(MESSAGES.email.email);

export const uniqueEmail = yup
  .string()
  .concat(email)
  .test({
    test: function (value) {
      return !this.options.context?.[CONTEXT_KEYS.existingEmails].includes(
        value,
      );
    },
    message: MESSAGES.uniqueEmail.notOneOf,
  });

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
      return score >= this.options.context?.[CONTEXT_KEYS.passwordStrength];
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

export const name = yup.string().required(MESSAGES.name.required);

export const firstName = yup.string().required(MESSAGES.firstName.required);

export const lastName = yup.string().required(MESSAGES.lastName.required);

export const acceptedTerms = yup
  .bool()
  .oneOf([true], MESSAGES.acceptedTerms.oneOf);

export const bookmarkTitle = yup
  .string()
  .required(MESSAGES.bookmarkTitle.required)
  .test({
    test: function (value) {
      return !this.options.context[CONTEXT_KEYS.bookmarkTitles].includes(value);
    },
    message: MESSAGES.bookmarkTitle.notOneOf,
  });

export const customerName = yup
  .string()
  .required(MESSAGES.customerName.required);

const compareDate = (comparisonFunction, contextKey, message) =>
  function (value) {
    if (!this.options.context?.[contextKey]) return true;
    const comparator = new Date(this.options.context[contextKey]);
    if (comparisonFunction(comparator, dateStringToDate(value)) === -1)
      return this.createError({
        message: message.replace(
          `{{${contextKey}}}`,
          format(comparator, 'dd/MM/yyyy'),
        ),
      });
    return true;
  };

export const date = yup.lazy(v =>
  !v
    ? yup.string()
    : yup
        .string()
        .matches(
          new RegExp(`^(\\d{1,2}(${DATE_SEPARATOR})){2}(\\d{2}){1,2}$`),
          MESSAGES.date.matches,
        )
        .test({
          name: 'Valid date',
          message: MESSAGES.date.valid,
          test: value => {
            return isValid(...toDMY(value));
          },
        })
        .test({
          name: 'Min Date',
          test: compareDate(
            compareDesc,
            CONTEXT_KEYS.minDate,
            MESSAGES.date.min,
          ),
        })
        .test({
          name: 'Max Date',
          test: compareDate(
            compareAsc,
            CONTEXT_KEYS.maxDate,
            MESSAGES.date.max,
          ),
        }),
);
