import React, { useState, useEffect } from 'react';

import {
  Button,
  Checkbox,
  PasswordField,
  PasswordStrengthMeter,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { EULA } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { Field } from 'components/field/field.component';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';
import {
  FIELD_NAMES,
  email,
  newPassword,
  newPasswordConfirm,
} from 'utils/validators';

import formStyles from 'forms.module.css';

const TeamMemberLoginSchema = yup.object({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.newPassword]: newPassword,
  [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
});

/**
 * @typedef {{
 *   serverErrors?: string[]
 *   isLoading?: boolean
 *   passwordMinLength: number
 *   passwordMaxLength: number
 *   passwordStrength: number
 *   email: string
 *   login: (data: { email: string, password: string}) => void
 *   activateAccount?: (data: {key: string}) => void
 * } & Partial<import('react-router-dom').RouteComponentProps>} TeamMemberLoginProps
 */

/**
 * @param {TeamMemberLoginProps} props
 */
const TeamMemberLogin = ({
  login,
  activateAccount,
  match,
  serverErrors,
  email,
  isLoading,
  passwordMinLength = 0,
  passwordMaxLength = 255,
  passwordStrength = 0,
}) => {
  useEffect(() => {
    if (match?.params?.key && activateAccount)
      activateAccount({ ...match.params });
  }, [activateAccount, match]);

  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    defaultValues: { email },
    resolver: yupResolver(TeamMemberLoginSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  const [termsAgreed, setTermsAgreed] = useState(false);

  const onSubmit = data => {
    const submission = { ...data, termsAgreed };
    login(submission);
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={serverErrors} />
      <div className={formStyles.fields}>
        <Field
          register={register}
          label="Work Email Address"
          name={FIELD_NAMES.email}
          errors={errors}
          readOnly
        />
        <Field
          register={register}
          label="Password *"
          name={FIELD_NAMES.newPassword}
          errors={errors}
          Component={PasswordField}
          autoFocus
        />
        <div className={formStyles.row}>
          <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
        </div>
        <Field
          register={register}
          label="Password Confirmation *"
          name={FIELD_NAMES.newPasswordConfirm}
          errors={errors}
          Component={PasswordField}
        />
        <Field
          register={register}
          label="Name"
          name={FIELD_NAMES.name}
          errors={errors}
        />

        <div className={formStyles.row}>
          <Checkbox
            name="loggedIn"
            label="I agree with"
            value="true"
            onChange={() => setTermsAgreed(!termsAgreed)}
          />
          &nbsp;
          <Button target="_blank" href={EULA} rel="noopener noreferrer">
            Terms &amp; Conditions
          </Button>
        </div>
      </div>

      <div className={formStyles.buttons}>
        <Button
          type="submit"
          disabled={!termsAgreed || Object.keys(errors).length > 0}
        >
          {isLoading ? <LoadingSpinner /> : 'Accept and Log in'}
        </Button>
      </div>
    </form>
  );
};

export default TeamMemberLogin;
