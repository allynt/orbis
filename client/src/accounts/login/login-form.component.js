import React, { useEffect } from 'react';

import {
  Button,
  Checkbox,
  PasswordField,
  Textfield,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { PASSWORD_RESET_URL, REGISTER_URL } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { FieldError } from 'components/field-error/field-error.component';
import { FIELD_NAMES, email, password } from 'utils/validators';

import formStyles from 'forms.module.css';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';

const loginSchema = yup.object({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.password]: password,
});

/**
 * @param {{
 *   isLoading?: boolean
 *   passwordMinLength: number
 *   passwordMaxLength: number
 *   serverErrors?: string[]
 *   user: any
 *   activateAccount?: (data: {key: string}) => void
 *   login: (data: { email: string, password: string}) => void
 * } & Partial<import('react-router-dom').RouteComponentProps>} props
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
  useEffect(() => {
    if (
      (match?.params?.key && !user?.is_verified) ||
      user?.is_verified === 'False'
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
        <div className={formStyles.row}>
          <label className={formStyles.hiddenLabel} htmlFor={FIELD_NAMES.email}>
            Email
          </label>
          <Textfield
            id={FIELD_NAMES.email}
            name={FIELD_NAMES.email}
            ref={register}
            placeholder="Email"
            autoFocus
          />
        </div>
        {errors.email && <FieldError message={errors.email.message} />}

        <div className={formStyles.row}>
          <label
            className={formStyles.hiddenLabel}
            htmlFor={FIELD_NAMES.password}
          >
            Password
          </label>
          <PasswordField
            id={FIELD_NAMES.password}
            name={FIELD_NAMES.password}
            ref={register}
            placeholder="Password"
          />
        </div>
        {errors.password && <FieldError message={errors.password.message} />}

        <div className={`${formStyles.row} ${formStyles.incidentals}`}>
          <Checkbox
            name="loggedIn"
            value="true"
            label="Keep me logged in"
            onChange={() => console.log('Keep me logged in')}
          />

          <p className={formStyles.row}>
            <Link to={PASSWORD_RESET_URL}>
              <Button type="button" theme="link">
                Forgot password?
              </Button>
            </Link>
          </p>
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

      <p className={formStyles.footer}>
        Don't have an account?&nbsp;
        <Link to={REGISTER_URL}>
          <Button theme="link">Sign Up</Button>
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
