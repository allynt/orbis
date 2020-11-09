import React from 'react';

import {
  Button,
  PasswordField,
  PasswordStrengthMeter,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { object as yupObject } from 'yup';

import { LOGIN } from 'accounts/accounts.constants';
import { status } from 'accounts/accounts.slice';
import { ErrorWell } from 'accounts/error-well.component';
import { FieldError } from 'components/field-error/field-error.component';
import { FIELD_NAMES, newPassword, newPasswordConfirm } from 'utils/validators';

import formStyles from 'forms.module.css';

const PasswordResetSuccessView = () => (
  <div className={formStyles.form}>
    <p className={formStyles.paragraph}>
      Your password has successfully been reset. Click the button to continue.
    </p>

    <div className={formStyles.buttons}>
      <Link to={LOGIN}>
        <Button theme="link">Continue</Button>
      </Link>
    </div>
  </div>
);

const validationSchema = yupObject({
  [FIELD_NAMES.newPassword]: newPassword,
  [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
});

const PasswordResetForm = ({
  confirmResetPassword,
  resetStatus,
  match,
  error,
  passwordMinLength,
  passwordMaxLength,
  passwordStrength,
}) => {
  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  if (resetStatus === status.COMPLETE) {
    return <PasswordResetSuccessView />;
  }

  const onSubmit = submission => {
    confirmResetPassword(submission, match.params);
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={error} />

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <label
            className={formStyles.hiddenLabel}
            htmlFor={FIELD_NAMES.newPassword}
          >
            Password Confirmation
          </label>
          <PasswordField
            id={FIELD_NAMES.newPassword}
            name={FIELD_NAMES.newPassword}
            ref={register}
            placeholder="New Password"
            autoFocus
          />
        </div>
        {errors[FIELD_NAMES.newPassword] && (
          <FieldError message={errors[FIELD_NAMES.newPassword].message} />
        )}

        <div className={formStyles.row}>
          <label
            className={formStyles.hiddenLabel}
            htmlFor={FIELD_NAMES.newPasswordConfirm}
          >
            Password Confirmation
          </label>
          <PasswordField
            id={FIELD_NAMES.newPasswordConfirm}
            name={FIELD_NAMES.newPasswordConfirm}
            ref={register}
            placeholder="New Password Confirmation"
          />
        </div>
        {errors[FIELD_NAMES.newPasswordConfirm] && (
          <FieldError
            message={errors[FIELD_NAMES.newPasswordConfirm].message}
          />
        )}

        <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
      </div>

      <div className={formStyles.buttons}>
        <Button type="submit" disabled={Object.keys(errors).length > 0}>
          Reset Password
        </Button>
      </div>

      <p className={formStyles.footer}>
        Do you have an account?&nbsp;
        <Link to={LOGIN}>
          <Button theme="link">Login</Button>
        </Link>
      </p>
    </form>
  );
};

export default PasswordResetForm;
