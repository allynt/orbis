import React, { useEffect } from 'react';

import { Button, Checkbox, PasswordField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { PASSWORD_RESET_REQUEST, REGISTER } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { Field } from 'components/field/field.component';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';
import { FIELD_NAMES, email, password } from 'utils/validators';

import formStyles from 'forms.module.css';
import styles from './login-form.module.css';

const loginSchema = yup.object({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.password]: password,
});

/**
 * @typedef {{
 *   isLoading?: boolean
 *   passwordMinLength: number
 *   passwordMaxLength: number
 *   serverErrors?: string[]
 *   user: User
 *   activateAccount?: (data: {key: string}) => void
 *   login: (data: { email: string, password: string}) => void
 * } & Partial<import('react-router-dom').RouteComponentProps>} LoginProps
 */

/**
 * @param {LoginProps} props
 */
const LoginForm = ({
  isLoading = false,
  match,
  passwordMinLength,
  passwordMaxLength,
  serverErrors,
  user,
  activateAccount,
  login,
}) => {
  const isRegisteringCustomer = user?.registration_stage;

  useEffect(() => {
    if (
      match?.params?.key &&
      activateAccount &&
      (!user?.is_verified || user?.is_verified === 'False')
    )
      activateAccount({ ...match.params });
  }, [activateAccount, match, user]);

  const { register, handleSubmit, formState, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(loginSchema),
    context: { passwordMinLength, passwordMaxLength },
  });

  const onSubmit = data => {
    login(data);
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      {serverErrors && <ErrorWell errors={serverErrors} />}

      <div className={formStyles.fields}>
        <Field
          register={register}
          label={isRegisteringCustomer ? 'Work Email Address *' : 'Email *'}
          name={FIELD_NAMES.email}
          errors={errors}
          autoFocus
        />
        <Field
          register={register}
          label="Password *"
          name={FIELD_NAMES.password}
          errors={errors}
          Component={PasswordField}
        />

        <div className={formStyles.row}>
          {!isRegisteringCustomer && (
            <Checkbox
              name="loggedIn"
              value="true"
              label="Keep me logged in"
              onChange={() => console.log('Keep me logged in')}
            />
          )}

          <Link className={styles.forgotPassword} to={PASSWORD_RESET_REQUEST}>
            <Button type="button" theme="link">
              Forgot password?
            </Button>
          </Link>
        </div>
      </div>

      <div className={formStyles.buttons}>
        <Button
          type="submit"
          theme="primary"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          {isLoading ? <LoadingSpinner /> : 'Login'}
        </Button>
      </div>

      {!isRegisteringCustomer && (
        <p className={formStyles.footer}>
          Don't have an account?&nbsp;
          <Link to={REGISTER}>
            <Button theme="link">Sign Up</Button>
          </Link>
        </p>
      )}
    </form>
  );
};

export default LoginForm;
