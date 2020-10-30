import React, { useEffect } from 'react';

import { Redirect } from 'react-router-dom';

import { Button, PasswordField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { LOGIN } from 'accounts/accounts.constants';
import { status } from 'accounts/accounts.slice';
import { ErrorWell } from 'accounts/error-well.component';
import { Field } from 'components/field/field.component';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';
import { FIELD_NAMES, password } from 'utils/validators';

import formStyles from 'forms.module.css';

const TeamMemberLoginSchema = yup.object({
  [FIELD_NAMES.password]: password,
});

/**
 * @typedef {{
 *   serverErrors?: string[]
 *   isLoading?: boolean
 *   email: string
 *   login: (data: { email: string, password: string}) => void
 *   changeStatus: (data: { email: string, password: string}) => void
 *   activateAccount?: (data: {key: string}) => void
 * } & Partial<import('react-router-dom').RouteComponentProps>} TeamMemberLoginProps
 */

/**
 * @param {TeamMemberLoginProps} props
 */
const TeamMemberLogin = ({
  login,
  changeStatus,
  activateAccount,
  match,
  serverErrors,
  email,
  isLoading,
}) => {
  useEffect(() => {
    if (match?.params?.key && activateAccount)
      activateAccount({ ...match.params });
  }, [activateAccount, match]);

  useEffect(() => {
    if (changeStatus === status.PENDING) {
      return <Redirect to={LOGIN} />;
    }
  }, [changeStatus]);

  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    defaultValues: { email },
    resolver: yupResolver(TeamMemberLoginSchema),
  });

  const showLoadingSpinner = isLoading || changeStatus !== status.PENDING;

  const onSubmit = submission => {
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
        />
        <Field
          register={register}
          label="Password *"
          name={FIELD_NAMES.password}
          errors={errors}
          Component={PasswordField}
          autoFocus
        />
      </div>

      <div className={formStyles.buttons}>
        <Button type="submit" disabled={Object.keys(errors).length > 0}>
          {showLoadingSpinner ? <LoadingSpinner /> : 'Log in'}
        </Button>
      </div>
    </form>
  );
};

export default TeamMemberLogin;
