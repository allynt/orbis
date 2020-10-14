import React from 'react';

import {
  Button,
  Checkbox,
  PasswordField,
  Textfield,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { object as yupObject } from 'yup';

import { LOGIN_URL, TERMS_URL } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';
import {
  acceptedTerms,
  email,
  FIELD_NAMES,
  firstName,
  lastName,
  newPassword,
  newPasswordConfirm,
} from 'utils/validators';

const Field = ({ name, label, Component = Textfield, register }) => (
  <label htmlFor={name}>
    {label}
    <Component ref={register} id={name} name={name} />
  </label>
);

/**
 * @typedef {{
 *  email: string
 *  firstName: string
 *  lastName: string
 *  newPassword: string
 *  newPasswordConfirm: string
 *  acceptedTerms: boolean
 * }} FormValues
 */

const validationSchema = yupObject({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.firstName]: firstName,
  [FIELD_NAMES.lastName]: lastName,
  [FIELD_NAMES.newPassword]: newPassword,
  [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
  [FIELD_NAMES.acceptedTerms]: acceptedTerms,
});

/**
 * @param {{
 *   serverErrors?: string[]
 *   isLoading: boolean
 *   onSubmit(values: FormValues): void
 *   passwordMinLength?: number,
 *   passwordMaxLength?: number,
 *   passwordStrength?: number
 * }} props
 */
const UserRegistration = ({
  serverErrors,
  isLoading = false,
  onSubmit,
  passwordMinLength = 0,
  passwordMaxLength = 255,
  passwordStrength = 0,
}) => {
  const { handleSubmit, register, watch } = useForm({
    defaultValues: { acceptedTerms: false },
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  return (
    <form
      onSubmit={handleSubmit(
        /** @param {FormValues} values */
        values => onSubmit(values),
      )}
    >
      <ErrorWell errors={serverErrors} />
      <Field
        register={register}
        name={FIELD_NAMES.email}
        label="Work Email Address*"
      />
      <Field
        register={register}
        name={FIELD_NAMES.firstName}
        label="First Name*"
      />
      <Field
        register={register}
        name={FIELD_NAMES.lastName}
        label="Last Name*"
      />
      <Field
        register={register}
        name={FIELD_NAMES.newPassword}
        label="Password*"
        Component={PasswordField}
      />
      <Field
        register={register}
        name={FIELD_NAMES.newPasswordConfirm}
        label="Password Confirmation*"
        Component={PasswordField}
      />
      <Checkbox
        name={FIELD_NAMES.acceptedTerms}
        ref={register}
        label={
          <>
            I agree with{' '}
            <Button href={TERMS_URL} rel="noreferrer noopener" target="_blank">
              Terms &amp; Conditions
            </Button>
          </>
        }
      />
      <Button type="submit" disabled={!watch(FIELD_NAMES.acceptedTerms)}>
        {isLoading ? <LoadingSpinner /> : 'Sign Up'}
      </Button>
      <p>
        Do you have an account?{' '}
        <Link to={LOGIN_URL}>
          <Button theme="link">Login</Button>
        </Link>
      </p>
    </form>
  );
};

export default UserRegistration;
