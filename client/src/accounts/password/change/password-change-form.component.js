import React, { useState } from 'react';

import {
  Button,
  PasswordField,
  PasswordStrengthMeter,
  Checkbox,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object } from 'yup';

import { status } from 'accounts/accounts.slice';
import { LOGIN, TERMS } from 'accounts/accounts.constants';
import { FieldError } from 'components/field-error/field-error.component';
import {
  FIELD_NAMES,
  newPassword,
  newPasswordConfirm,
  oldPassword,
} from 'utils/validators';

import formStyles from 'forms.module.css';
import { Link } from 'react-router-dom';
import { ErrorWell } from 'accounts/error-well.component';

const ChangePasswordSuccessView = () => (
  <div className={formStyles.form}>
    <div className={formStyles.textContent}>
      <p className={formStyles.paragraph}>
        Thank you! Your password has been changed.
      </p>
      <p className={formStyles.paragraph}>
        You have completed your ORBIS account. Click the button in order to
        continue.
      </p>
    </div>

    <div className={formStyles.buttons}>
      <Link to={LOGIN}>
        <Button theme="link">Continue</Button>
      </Link>
    </div>
  </div>
);

const validationSchema = object({
  oldPassword,
  newPassword,
  newPasswordConfirm,
});

const PasswordChangeForm = ({
  changePassword,
  changeStatus,
  error,
  passwordMinLength,
  passwordMaxLength,
  passwordStrength,
}) => {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  if (changeStatus === status.PENDING) return <ChangePasswordSuccessView />;

  const onSubmit = data => {
    changePassword({
      ...data,
      accepted_terms: termsAgreed,
    });
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={error} />

      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <PasswordField
            name={FIELD_NAMES.oldPassword}
            ref={register}
            placeholder="Old Password"
            autoFocus
          />
        </div>
        {errors[FIELD_NAMES.oldPassword] && (
          <FieldError message={errors[FIELD_NAMES.oldPassword].message} />
        )}

        <div className={formStyles.row}>
          <PasswordField
            name={FIELD_NAMES.newPassword}
            ref={register}
            placeholder="New Password"
          />
        </div>
        {errors[FIELD_NAMES.newPassword] && (
          <FieldError message={errors[FIELD_NAMES.newPassword].message} />
        )}

        <div className={formStyles.row}>
          <PasswordField
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

        <div className={formStyles.row}>
          <Checkbox
            name="loggedIn"
            value="true"
            label="I agree with"
            onChange={() => setTermsAgreed(!termsAgreed)}
          />
          &nbsp;
          <Button target="_blank" rel="noopener noreferrer" href={TERMS}>
            Terms &amp; Conditions
          </Button>
        </div>
      </div>

      <div className={formStyles.buttons}>
        <Button
          type="submit"
          disabled={!termsAgreed || Object.keys(errors).length > 0}
        >
          Change Password
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

export default PasswordChangeForm;
