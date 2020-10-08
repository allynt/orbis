import React, { useState } from 'react';

import {
  Button,
  PasswordField,
  PasswordStrengthMeter,
  Checkbox,
  Well,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object } from 'yup';

import { status } from 'accounts/accounts.slice';
import { LOGIN_URL, TERMS_URL } from 'accounts/accounts.constants';
import { FieldError } from 'accounts/field-error.component';
import {
  newPassword,
  newPasswordConfirm,
  oldPassword,
} from 'utils/validators/validators';
import { FIELD_NAMES } from 'utils/validators/constants';

import formStyles from 'forms.module.css';
import { Link } from 'react-router-dom';

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
      <Link to={LOGIN_URL}>
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
        {errors.new_password2 && errors.new_password2.type === 'validate' && (
          <FieldError message="New Passwords don't match" />
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
          <Button target="_blank" rel="noopener noreferrer" href={TERMS_URL}>
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
        <Link to={LOGIN_URL}>
          <Button theme="link">Login</Button>
        </Link>
      </p>
    </form>
  );
};

export default PasswordChangeForm;
