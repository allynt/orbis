import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import useForm from '../hooks/useForm';
import validate from './login-form.validator';

import { Button, PasswordField, Textfield, Checkbox, Well } from '@astrosat/astrosat-ui';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import formStyles from './forms.module.css';
import loginStyles from './login-form.module.css';

const LoginForm = ({ error, login, user, from }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    login(values);
  }

  // Re-direct to originally clicked URL on successful login.
  if (user) {
    return <Redirect to={from} />;
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
              name="username"
              value={values.username || ''}
              placeholder="Email"
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          {errors.username && <p className={formStyles.errorMessage}>{errors.username}</p>}

          <div className={formStyles.row}>
            <PasswordField name="password" value={values.password || ''} onChange={handleChange} required />
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
              <Button theme="link" href="/password/reset">
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
          <Button theme="link" href="/register">
            Sign Up
          </Button>
        </p>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  error: PropTypes.object,
  login: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default LoginForm;
