import React from 'react';

import { Button, Textfield } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object } from 'yup';

import { ErrorWell } from 'accounts/error-well.component';
import { FieldError } from 'accounts/field-error.component';
import { LOGIN_URL } from '../../accounts.constants';
import { status } from '../../accounts.slice';
import { FIELD_NAMES } from 'utils/validators/constants';
import { email } from 'utils/validators/validators';

import formStyles from 'forms.module.css';

const PasswordResetSuccessView = ({ email, onSubmit }) => (
  <div className={formStyles.form}>
    <div className={formStyles.textContent}>
      <p className={formStyles.paragraph}>
        <strong>Check your email</strong>
      </p>

      <p className={formStyles.paragraph}>
        If <strong>{email}</strong> is associated with an Astrosat ID, you
        should receive an email containing instructions on how to create a new
        password.
      </p>

      <p className={formStyles.paragraph}>
        <strong>You haven't received the email?</strong>
      </p>
      <p className={formStyles.paragraph}>
        Please check your spam or bulk folders.
      </p>
    </div>

    <div className={formStyles.buttons}>
      <Button theme="secondary" onClick={() => onSubmit(email)}>
        Resend email
      </Button>
      <Button href={LOGIN_URL}>Return to login</Button>
    </div>
  </div>
);

const validationSchema = object({
  [FIELD_NAMES.email]: email,
});

const PasswordResetForm = ({ resetPassword, resetStatus, error }) => {
  const { register, handleSubmit, getValues, formState, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = data => {
    resetPassword(data);
  };

  if (resetStatus === status.PENDING)
    return (
      <PasswordResetSuccessView email={getValues().email} onSubmit={onSubmit} />
    );

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={error} />

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <Textfield
            name={FIELD_NAMES.email}
            ref={register}
            placeholder="Email"
            autoFocus
          />
        </div>
        {errors[FIELD_NAMES.email] && (
          <FieldError message={errors[FIELD_NAMES.email].message} />
        )}
      </div>

      <div className={formStyles.buttons}>
        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
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
