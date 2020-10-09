import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  PasswordField,
  PasswordStrengthMeter,
  Well,
} from '@astrosat/astrosat-ui';

import { useForm } from 'react-hook-form';

import { LOGIN_URL, TERMS_URL } from 'accounts/accounts.constants';
import { status } from 'accounts/accounts.slice';
import { FieldError } from 'accounts/field-error.component';

import formStyles from 'forms.module.css';

const PasswordResetSuccessView = ({ error }) => (
  <div className={formStyles.form}>
    {error && (
      <Well type="error">
        <ul>
          {error.map(error => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </Well>
    )}

    <p className={formStyles.paragraph}>
      Your password has successfully been reset. Click the button to continue.
    </p>

    <div className={formStyles.buttons}>
      <Button href={LOGIN_URL}>Continue</Button>
    </div>
  </div>
);

const PasswordResetForm = ({
  confirmResetPassword,
  resetStatus,
  match,
  error,
}) => {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { register, handleSubmit, getValues, errors } = useForm({
    mode: 'onBlur',
  });

  if (resetStatus === status.COMPLETE) {
    return <PasswordResetSuccessView />;
  }

  const onSubmit = data => {
    confirmResetPassword({ ...data, termsAgreed }, match.params);
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Well type="error">
          <ul data-testid="error-well">
            {error.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Well>
      )}

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor="password2">
            Password Confirmation
          </label>
          <PasswordField
            id="new_password1"
            name="new_password1"
            ref={register}
            placeholder="New Password"
            required
            autoFocus
          />
        </div>
        {errors.new_password1 && (
          <FieldError message={errors.new_password1.message} />
        )}

        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor="password2">
            Password Confirmation
          </label>
          <PasswordField
            id="new_password2"
            name="new_password2"
            ref={register}
            placeholder="New Password Confirmation"
            required
          />
        </div>
        {errors.new_password2 && (
          <FieldError message={errors.new_password2.message} />
        )}
        {errors.new_password2 && errors.new_password2.type === 'validate' && (
          <FieldError message="Passwords don't match" />
        )}

        <PasswordStrengthMeter password={getValues().new_password1} />

        <div className={formStyles.row}>
          <Checkbox
            name="loggedIn"
            value="true"
            label="I agree with"
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
          disabled={!termsAgreed || Object.keys(errors).length > 0}
        >
          Reset Password
        </Button>
      </div>

      <p className={formStyles.footer}>
        Do you have an account?&nbsp;
        <Button href={LOGIN_URL}>Login</Button>
      </p>
    </form>
  );
};

export default PasswordResetForm;
