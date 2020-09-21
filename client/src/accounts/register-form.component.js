import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import validate from './register-form.validator';

import {
  Button,
  PasswordField,
  PasswordStrengthMeter,
  Textfield,
  Checkbox,
  useForm,
  Well,
} from '@astrosat/astrosat-ui';

import { status } from './accounts.slice';

import { LOGIN_URL, TERMS_URL } from './accounts.constants';

import formStyles from '../forms.module.css';

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
  register,
  registerUserStatus,
  resendVerificationEmail,
  error,
}) => {
  const { passwordMinLength, passwordMaxLength } = useSelector(
    state => state.app.config,
  );
  const validators = {
    passwordMinLength,
    passwordMaxLength,
  };
  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate,
    validators,
  );

  const config = useSelector(state => state.app.config);

  const [termsAgreed, setTermsAgreed] = useState(false);

  if (registerUserStatus === status.PENDING)
    return (
      <RegisterFormSuccessView
        email={values.email}
        resendVerificationEmail={resendVerificationEmail}
      />
    );

  function onSubmit() {
    const data = {
      ...values,
      accepted_terms: termsAgreed,
    };
    register(data);
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      {config && !config.isRegistrationOpen && (
        <Well type="error">
          <div>We are sorry, but the signup is currently closed.</div>
        </Well>
      )}

      {error && (
        <Well type="error">
          <ul>
            {error.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Well>
      )}

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <Textfield
            name="email"
            value={values.email?.trim() || ''}
            placeholder="Email"
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        {errors.email && (
          <p className={formStyles.errorMessage}>{errors.email}</p>
        )}

        <div className={formStyles.row}>
          <PasswordField
            name="password1"
            value={values.password1 || ''}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        {errors.password1 && (
          <p className={formStyles.errorMessage}> {errors.password1}</p>
        )}

        <div className={formStyles.row}>
          <PasswordStrengthMeter password={values.password1} />
        </div>

        <div className={formStyles.row}>
          <PasswordField
            name="password2"
            value={values.password2 || ''}
            onChange={handleChange}
            placeholder="Password Confirmation"
            required
          />
        </div>
        {errors.password2 && (
          <p className={formStyles.errorMessage}>{errors.password2}</p>
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
            Terms &amp; Conditions, Privacy Policy
          </Button>
        </div>
      </div>
      <div className={formStyles.buttons}>
        <Button
          type="submit"
          disabled={
            !termsAgreed ||
            (config && !config.isRegistrationOpen) ||
            Object.keys(errors).length > 0 ||
            Object.keys(values).length === 0
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
