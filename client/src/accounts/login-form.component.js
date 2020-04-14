import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import validate from './login-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import PasswordField from '@astrosat/astrosat-ui/dist/forms/password-field';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import { REGISTER_URL, PASSWORD_RESET_URL } from './accounts.constants';

import formStyles from './forms.module.css';
import loginStyles from './login-form.module.css';

const LoginForm = ({ login, user, error }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);
  // const error = useSelector(state => state.accounts.error);
  // const user = useSelector(state => state.accounts.user);

  function onSubmit() {
    login(values);
  }

  // Re-direct to originally clicked URL on successful login.
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <OrbisLogo className={formStyles.logo} />

        {error && (
          <Well type="error">
            <div>{error.message}</div>
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

          <div className={formStyles.row}>
            <PasswordField
              name="password"
              value={values.password || ''}
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          {errors.password && <p className={formStyles.errorMessage}>{errors.password}</p>}

          <div className={`${formStyles.row} ${loginStyles.incidentals}`}>
            <Checkbox
              name="loggedIn"
              value="true"
              label="Keep me logged in"
              onChange={() => console.log('Keep me logged in')}
            />
            <p className={formStyles.row}>
              Forgotten your&nbsp;
              <Button theme="link" href={PASSWORD_RESET_URL}>
                password?
              </Button>
            </p>
          </div>
        </div>

        <div className={formStyles.buttons}>
          <Button
            type="submit"
            theme="primary"
            className={formStyles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Login
          </Button>
        </div>

        <p className={loginStyles.footer}>
          Don't have an account?&nbsp;
          <Button theme="link" href={REGISTER_URL}>
            Sign Up
          </Button>
        </p>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  location: PropTypes.object
};

export default LoginForm;
