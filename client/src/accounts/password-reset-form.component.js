import React from 'react';

import validate from './password-reset-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import { status } from './accounts.slice';

import { LOGIN_URL } from './accounts.constants';

import formStyles from '../forms.module.css';

const PasswordResetSuccessView = ({ email, onSubmit }) => (
  <div className={formStyles.form}>
    <div className={formStyles.textContent}>
      <p className={formStyles.paragraph}>
        <strong>Check your email</strong>
      </p>

      <p className={formStyles.paragraph}>
        If <strong>{email}</strong> is associated with an Astrosat ID, you should receive an email containing
        instructions on how to create a new password.
      </p>

      <p className={formStyles.paragraph}>
        <strong>You haven't received the email?</strong>
      </p>
      <p className={formStyles.paragraph}>Please check your spam or bulk folders.</p>
    </div>

    <div className={formStyles.buttons}>
      <Button theme="secondary" onClick={() => onSubmit(email)}>
        Resend email
      </Button>
      <Button href={LOGIN_URL}>Return to login</Button>
    </div>
  </div>
);

const PasswordResetForm = ({ resetPassword, resetStatus, error }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  if (resetStatus === status.PENDING) return <PasswordResetSuccessView email={values.email} onSubmit={onSubmit} />;

  function onSubmit() {
    resetPassword(values);
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
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
            value={values.email || ''}
            placeholder="Email"
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        {errors.email && <p className={formStyles.errorMessage}>{errors.email}</p>}
      </div>

      <div className={formStyles.buttons}>
        <Button type="submit" disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}>
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
