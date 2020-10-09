import React, { useState } from 'react';

import validate from './password-reset-confirm-form.validator';

import {
  Button,
  PasswordField,
  PasswordStrengthMeter,
  Checkbox,
  useForm,
  Well,
} from '@astrosat/astrosat-ui';

import { status } from 'accounts/accounts.slice';

import { LOGIN_URL, TERMS_URL } from 'accounts/accounts.constants';

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

const PasswordResetConfirmForm = ({
  confirmResetPassword,
  resetStatus,
  match,
  error,
}) => {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate,
  );

  if (resetStatus === status.COMPLETE) {
    return <PasswordResetSuccessView />;
  }

  function onSubmit() {
    const data = {
      ...values,
      termsAgreed,
    };
    confirmResetPassword(data, match.params);
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
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
          <PasswordField
            name="new_password1"
            value={values.new_password1 || ''}
            onChange={handleChange}
            placeholder="New Password"
            required
            autoFocus
          />
        </div>
        {errors.new_password1 && (
          <p className={formStyles.errorMessage}>{errors.new_password1}</p>
        )}

        <PasswordStrengthMeter password={values.new_password1} />

        <div className={formStyles.row}>
          <PasswordField
            name="new_password2"
            value={values.new_password2 || ''}
            onChange={handleChange}
            placeholder="New Password Confirmation"
            required
          />
        </div>
        {errors.new_password2 && (
          <p className={formStyles.errorMessage}>{errors.new_password2}</p>
        )}

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
          disabled={
            !termsAgreed ||
            Object.keys(errors).length > 0 ||
            Object.keys(values).length === 0
          }
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

export default PasswordResetConfirmForm;
