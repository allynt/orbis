import React, { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  PasswordField,
  Textfield,
  Well,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';
import * as yup from 'yup';

import { PASSWORD_RESET_URL, REGISTER_URL } from 'accounts/accounts.constants';
import { status } from '../accounts.slice';
import { FieldError } from '../field-error.component';
import { RegisterFormSuccessView } from '../register/register-form.component';
import { FIELD_NAMES, email, password } from 'utils/validators';

import formStyles from 'forms.module.css';
import { ErrorWell } from 'accounts/error-well.component';

const loginSchema = yup.object({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.password]: password,
});

const LoginForm = ({
  login,
  user,
  error,
  resendVerificationEmail,
  verificationEmailStatus,
  passwordMinLength,
  passwordMaxLength,
}) => {
  const [notVerified, setNotVerified] = useState(false);

  const { register, handleSubmit, getValues, formState, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(loginSchema),
    context: { passwordMinLength, passwordMaxLength },
  });
  const NOT_VERIFIED_ERROR_MESSAGE = `User ${
    getValues().email
  } is not verified.`;

  useEffect(() => {
    if (error?.includes(NOT_VERIFIED_ERROR_MESSAGE) && !notVerified)
      setNotVerified(true);
  }, [error, NOT_VERIFIED_ERROR_MESSAGE, notVerified]);

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
      {error && <ErrorWell errors={error} />}

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor={FIELD_NAMES.email}>
            Email
          </label>
          <Textfield
            id={FIELD_NAMES.email}
            name={FIELD_NAMES.email}
            ref={register}
            placeholder="Email"
            autoFocus
          />
        </div>
        {errors.email && <FieldError message={errors.email.message} />}

        <div className={formStyles.row}>
          <label
            className={formStyles.hiddenLabel}
            htmlFor={FIELD_NAMES.password}
          >
            Password
          </label>
          <PasswordField
            id={FIELD_NAMES.password}
            name={FIELD_NAMES.password}
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
            <Link to={PASSWORD_RESET_URL}>
              <Button type="button" theme="link">
                Forgot password?
              </Button>
            </Link>
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
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Login
        </Button>
      </div>

      <p className={formStyles.footer}>
        Don't have an account?&nbsp;
        <Link to={REGISTER_URL}>
          <Button theme="link">Sign Up</Button>
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
