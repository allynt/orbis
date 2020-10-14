import React, { useState } from 'react';

import {
  Button,
  PasswordField,
  PasswordStrengthMeter,
  Textfield,
  Checkbox,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { object as objectSchema } from 'yup';

import { LOGIN_URL, TERMS_URL } from 'accounts/accounts.constants';
import { status } from 'accounts/accounts.slice';
import { ErrorWell } from 'accounts/error-well.component';
import { FieldError } from 'components/field-error/field-error.component';
import {
  FIELD_NAMES,
  email,
  newPassword,
  newPasswordConfirm,
} from 'utils/validators';

import formStyles from 'forms.module.css';

export const RegisterFormSuccessView = ({ email, resendVerificationEmail }) => (
  <div className={formStyles.form}>
    <div className={formStyles.textContent}>
      <p className={formStyles.paragraph}>
        <strong>Check your email</strong>
      </p>

      <p className={formStyles.paragraph}>
        An email has been sent to <strong>{email}</strong>. Please click the
        link inside to verify your account before logging in.
      </p>

      <p className={formStyles.paragraph}>
        <strong>You haven't received the email?</strong>
      </p>

      <p className={formStyles.paragraph}>
        Please check your spam or bulk folders.
      </p>
    </div>

    <div className={formStyles.buttons}>
      <Button theme="secondary" onClick={() => resendVerificationEmail(email)}>
        Resend email
      </Button>
      <Link to={LOGIN_URL}>
        <Button theme="link">Continue</Button>
      </Link>
    </div>
  </div>
);

const validationSchema = objectSchema({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.newPassword]: newPassword,
  [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
});

const RegisterForm = ({
  registerUser,
  registerUserStatus,
  resendVerificationEmail,
  error,
  isRegistrationOpen = true,
  passwordMinLength,
  passwordMaxLength,
  passwordStrength,
}) => {
  const { register, handleSubmit, getValues, errors, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  const [termsAgreed, setTermsAgreed] = useState(false);

  if (registerUserStatus === status.PENDING)
    return (
      <RegisterFormSuccessView
        email={getValues().email}
        resendVerificationEmail={resendVerificationEmail}
      />
    );

  const onSubmit = data => {
    registerUser({ ...data, accepted_terms: termsAgreed });
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={error}>
        {!isRegistrationOpen && (
          <li>We are sorry, but the signup is currently closed.</li>
        )}
      </ErrorWell>

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor={FIELD_NAMES.email}>
            Email as Username
          </label>
          <Textfield
            id={FIELD_NAMES.email}
            name={FIELD_NAMES.email}
            ref={register}
            placeholder="Email"
            autoFocus
          />
        </div>
        {errors[FIELD_NAMES.email] && (
          <FieldError message={errors[FIELD_NAMES.email].message} />
        )}

        <div className={formStyles.row}>
          <label
            className={formStyles.hiddenLabel}
            htmlFor={FIELD_NAMES.newPassword}
          >
            Password
          </label>
          <PasswordField
            id={FIELD_NAMES.newPassword}
            name={FIELD_NAMES.newPassword}
            ref={register}
            placeholder="Password"
          />
        </div>
        {errors[FIELD_NAMES.newPassword] && (
          <FieldError message={errors[FIELD_NAMES.newPassword].message} />
        )}

        <div className={formStyles.row}>
          <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
        </div>

        <div className={formStyles.row}>
          <label
            className={formStyles.hiddenLabel}
            htmlFor={FIELD_NAMES.newPasswordConfirm}
          >
            Password Confirmation
          </label>
          <PasswordField
            id={FIELD_NAMES.newPasswordConfirm}
            name={FIELD_NAMES.newPasswordConfirm}
            ref={register}
            placeholder="Password Confirmation"
          />
        </div>
        {errors[FIELD_NAMES.newPasswordConfirm] && (
          <FieldError
            message={errors[FIELD_NAMES.newPasswordConfirm].message}
          />
        )}

        <div className={formStyles.row}>
          <Checkbox
            name="loggedIn"
            label="I agree with"
            value="true"
            onChange={() => setTermsAgreed(!termsAgreed)}
          />
          &nbsp;
          <Button target="_blank" href={TERMS_URL} rel="noopener noreferrer">
            Terms &amp; Conditions
          </Button>
        </div>
      </div>
      <div className={formStyles.buttons}>
        <Button
          type="submit"
          disabled={
            !termsAgreed ||
            !isRegistrationOpen ||
            Object.keys(errors).length > 0
          }
        >
          Sign Up
        </Button>
      </div>
      <p className={formStyles.footer}>
        Do you have an account?&nbsp;
        <Link to={LOGIN_URL}>
          <Button theme="link">Login</Button>
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
