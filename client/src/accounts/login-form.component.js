import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

import useForm from '../hooks/useForm';
import validate from './login-form.validator';

import { Button, PasswordField, Textfield, Checkbox } from '@astrosat/astrosat-ui';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import formStyles from './forms.module.css';
import loginStyles from './login-form.module.css';

const LoginForm = ({ login, user, from }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    login(values);
  }

  // Re-direct to originally clicked URL on successful login.
  if (user) {
    return <Redirect to={from} />;
  }

  return (
    <div className={formStyles.container}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <OrbisLogo className={formStyles.logo} />

        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <Textfield name="username" value={values.username || ''} placeholder="Email" onChange={handleChange} />
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
            <p>
              Forgotten your <Link to="/password/reset">password?</Link>
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
          Don't have an account?&nbsp;<Link to={'/register'}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default LoginForm;
