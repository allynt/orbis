import React from 'react';

import { Button, Textfield } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { object } from 'yup';

import { ErrorWell } from 'accounts/error-well.component';
import { FieldError } from 'components/field-error/field-error.component';
import { LOGIN_URL } from '../../accounts.constants';
import { status } from '../../accounts.slice';
import { FIELD_NAMES, email } from 'utils/validators';

import formStyles from 'forms.module.css';

const PasswordResetRequestSuccessView = ({ email, onSubmit }) => (
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
      <Link to={LOGIN_URL}>
        <Button theme="link">Return to login</Button>
      </Link>
    </div>
  </div>
);

const validationSchema = object({
  [FIELD_NAMES.email]: email,
});

const PasswordResetRequestForm = ({ resetPassword, resetStatus, error }) => {
  const { register, handleSubmit, getValues, formState, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = data => {
    resetPassword(data);
  };

  if (resetStatus === status.PENDING)
    return (
      <PasswordResetRequestSuccessView
        email={getValues().email}
        onSubmit={onSubmit}
      />
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
        <Link to={LOGIN_URL}>
          <Button theme="link">Login</Button>
        </Link>
      </p>
    </form>
  );
};

export default PasswordResetRequestForm;