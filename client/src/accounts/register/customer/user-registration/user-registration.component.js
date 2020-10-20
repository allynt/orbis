import React from 'react';

import {
  Button,
  Checkbox,
  PasswordField,
  PasswordStrengthMeter,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { object as yupObject } from 'yup';

import { LOGIN, TERMS } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { Field } from 'components/field/field.component';
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

import formStyles from 'forms.module.css';
import styles from './user-registration.module.css';

/**
 * @typedef {{
 *  email: string
 *  name: string
 *  newPassword: string
 *  newPasswordConfirm: string
 *  acceptedTerms: boolean
 *  requires_customer_registration_completion: boolean
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
 *   isLoading?: boolean
 *   onSubmit?:(values: FormValues) => void
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
  const { errors, handleSubmit, register, watch } = useForm({
    defaultValues: {
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      newPassword: undefined,
      newPasswordConfirm: undefined,
      acceptedTerms: false,
    },
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  return (
    <form
      className={formStyles.form}
      onSubmit={handleSubmit(
        ({ firstName, lastName, ...rest }) =>
          onSubmit &&
          onSubmit({
            ...rest,
            name: `${firstName} ${lastName}`,
            requires_customer_registration_completion: true,
          }),
      )}
    >
      <div className={styles.errorWell}>
        <ErrorWell errors={serverErrors} />
      </div>
      <div className={formStyles.fields}>
        <Field
          register={register}
          name={FIELD_NAMES.email}
          label="Work Email Address*"
          errors={errors}
        />
        <Field
          register={register}
          name={FIELD_NAMES.firstName}
          label="First Name*"
          errors={errors}
        />
        <Field
          register={register}
          name={FIELD_NAMES.lastName}
          label="Last Name*"
          errors={errors}
        />
        <Field
          register={register}
          name={FIELD_NAMES.newPassword}
          label="Password*"
          Component={PasswordField}
          errors={errors}
        />
        <div className={formStyles.row}>
          <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
        </div>
        <Field
          register={register}
          name={FIELD_NAMES.newPasswordConfirm}
          label="Password Confirmation*"
          Component={PasswordField}
          errors={errors}
        />
      </div>
      <Checkbox
        className={styles.terms}
        name={FIELD_NAMES.acceptedTerms}
        ref={register}
        label={
          <div className={styles.label}>
            I agree with
            <Button
              className={styles.link}
              href={TERMS}
              rel="noreferrer noopener"
              target="_blank"
            >
              Terms &amp; Conditions
            </Button>
          </div>
        }
      />
      <Button type="submit" disabled={!watch(FIELD_NAMES.acceptedTerms)}>
        {isLoading ? <LoadingSpinner /> : 'Sign Up'}
      </Button>
      <p className={styles.footer}>
        Do you have an account?{' '}
        <Link className={styles.link} to={LOGIN}>
          <Button theme="link">Login</Button>
        </Link>
      </p>
    </form>
  );
};

export default UserRegistration;
