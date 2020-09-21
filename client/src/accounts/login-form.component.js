import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

import validate from './login-form.validator';

import {
  Button,
  PasswordField,
  Textfield,
  Checkbox,
  useForm,
  Well,
} from '@astrosat/astrosat-ui';

import { status } from './accounts.slice';

import { REGISTER_URL, PASSWORD_RESET_URL } from './accounts.constants';

import { RegisterFormSuccessView } from './register-form.component';

import formStyles from '../forms.module.css';

const LoginForm = ({
  login,
  user,
  error,
  resendVerificationEmail,
  verificationEmailStatus,
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

  const [notVerified, setNotVerified] = useState(false);
  const NOT_VERIFIED = `${values.email} is not verified.`;

  // Re-direct to originally clicked URL on successful login.
  if (user) return <Redirect to="/" />;

  if (verificationEmailStatus === status.PENDING)
    return (
      <RegisterFormSuccessView
        email={values.email}
        resendVerificationEmail={resendVerificationEmail}
      />
    );

  function onSubmit() {
    login(values);
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      {error && (
        <Well type="error">
          <ul>
            {error.map(error => {
              // Adding '!notVerfied' condition allows only one state change, prevents infinite loop
              if (error === NOT_VERIFIED) !notVerified && setNotVerified(true);
              return <li key={error}>{error}</li>;
            })}
          </ul>
        </Well>
      )}

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <Textfield
            name="email"
            value={values.email || ''}
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
            name="password"
            value={values.password || ''}
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        {errors.password && (
          <p className={formStyles.errorMessage}>{errors.password}</p>
        )}

        <div className={`${formStyles.row} ${formStyles.incidentals}`}>
          <Checkbox
            name="loggedIn"
            value="true"
            label="Keep me logged in"
            onChange={() => console.log('Keep me logged in')}
          />

          <p className={formStyles.row}>
            <Button href={PASSWORD_RESET_URL}>Forgot password?</Button>
          </p>
        </div>
      </div>

      {notVerified && (
        <div className={formStyles.textContent}>
          <p className={formStyles.paragraph}>
            <strong>Check your email</strong>
          </p>

          <p className={formStyles.paragraph}>
            An email was sent to <strong>{values.email}</strong> when the
            account was registered. Please click the link inside to verify your
            account before logging in.
          </p>

          <p className={formStyles.paragraph}>
            <strong>You haven't received the email?</strong>
          </p>

          <p className={formStyles.paragraph}>
            Please check your spam or bulk folders.
          </p>
          <div className={formStyles.buttons}>
            <Button
              theme="secondary"
              onClick={() => {
                resendVerificationEmail(values.email);
              }}
            >
              Resend Verification Email
            </Button>
          </div>
        </div>
      )}

      <div className={formStyles.buttons}>
        <Button
          type="submit"
          theme="primary"
          disabled={
            Object.keys(errors).length > 0 || Object.keys(values).length === 0
          }
        >
          Login
        </Button>
      </div>

      <p className={formStyles.footer}>
        Don't have an account?&nbsp;
        <Button href={REGISTER_URL}>Sign Up</Button>
      </p>
    </form>
  );
};

LoginForm.propTypes = {
  location: PropTypes.object,
};

export default LoginForm;
