import React, { useState } from 'react';

import {
  Button,
  PasswordField,
  PasswordStrengthMeter,
  Textfield,
  Checkbox,
  Well,
} from '@astrosat/astrosat-ui';

import { useForm } from 'react-hook-form';

import { LOGIN_URL, TERMS_URL } from 'accounts/accounts.constants';
import { status } from 'accounts/accounts.slice';
import { FieldError } from 'accounts/field-error.component';

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
      <Button href={LOGIN_URL}>Continue</Button>
    </div>
  </div>
);

const RegisterForm = ({
  registerUser,
  registerUserStatus,
  resendVerificationEmail,
  error,
}) => {
  const { register, handleSubmit, getValues, errors } = useForm({
    mode: 'onBlur',
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
      {/* {config && !config.isRegistrationOpen && (
        <Well type="error">
          <div>We are sorry, but the signup is currently closed.</div>
        </Well>
      )} */}

      {error && (
        <Well type="error">
          <ul data-testid="error-well">
            {error.map(err => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </Well>
      )}

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor="email">
            Email as Username
          </label>
          <Textfield
            id="email"
            name="email"
            ref={register}
            placeholder="Email"
            required
            autoFocus
          />
        </div>
        {errors.email && <FieldError message={errors.email.message} />}

        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor="password1">
            Password
          </label>
          <PasswordField
            id="password1"
            name="password1"
            ref={register}
            placeholder="Password"
            required
          />
        </div>
        {errors.password1 && <FieldError message={errors.password1.message} />}

        <div className={formStyles.row}>
          <PasswordStrengthMeter password={getValues().password1} />
        </div>

        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor="password2">
            Password Confirmation
          </label>
          <PasswordField
            id="password2"
            name="password2"
            ref={register}
            placeholder="Password Confirmation"
            required
          />
        </div>
        {errors.password2 && <FieldError message={errors.password2.message} />}
        {errors.password2 && errors.password2.type === 'validate' && (
          <FieldError message="Passwords don't match" />
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
            // (config && !config.isRegistrationOpen) ||
            Object.keys(errors).length > 0
          }
        >
          Sign Up
        </Button>
      </div>
      <p className={formStyles.footer}>
        Do you have an account?&nbsp;
        <Button href={LOGIN_URL}>Login</Button>
      </p>
    </form>
  );
};

export default RegisterForm;
