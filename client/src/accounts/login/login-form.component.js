import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  PasswordField,
  Textfield,
  Well,
} from '@astrosat/astrosat-ui';

import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { PASSWORD_RESET_URL, REGISTER_URL } from 'accounts/accounts.constants';
import { status } from '../accounts.slice';
import { FieldError } from '../field-error.component';
import { RegisterFormSuccessView } from '../register-form.component';

import formStyles from 'forms.module.css';

const LoginForm = ({
  login,
  user,
  error,
  resendVerificationEmail,
  verificationEmailStatus,
}) => {
  const [notVerified, setNotVerified] = useState(false);

  const { passwordMinLength, passwordMaxLength } = useSelector(
    state => state.app.config,
  );
  const { register, handleSubmit, getValues, formState, errors } = useForm({
    mode: 'onBlur',
  });
  const NOT_VERIFIED = `${getValues().email} is not verified.`;

  // Re-direct to originally clicked URL on successful login.
  if (user) return <Redirect to="/" />;

  if (verificationEmailStatus === status.PENDING)
    return (
      <RegisterFormSuccessView
        email={getValues().email}
        resendVerificationEmail={resendVerificationEmail}
      />
    );

  const onSubmit = data => {
    login(data);
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Well type="error">
          <ul data-testid="error-well">
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
          <label className={formStyles.hiddenLabel} htmlFor="email">
            Email
          </label>
          <Textfield
            id="email"
            name="email"
            ref={register}
            placeholder="Email"
            autoFocus
          />
        </div>
        {errors.email && <FieldError message={errors.email.message} />}

        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor="password">
            Password
          </label>
          <PasswordField
            id="password"
            name="password"
            ref={register}
            placeholder="Password"
          />
        </div>
        {errors.password && <FieldError message={errors.password.message} />}

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
            An email was sent to <strong>{getValues().email}</strong> when the
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
                resendVerificationEmail(getValues().email);
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
          disabled={Object.keys(errors).length > 0 || !formState.dirty}
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

export default LoginForm;
