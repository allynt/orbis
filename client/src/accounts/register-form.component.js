import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useForm from '../hooks/useForm';
import validate from './register-form.validator';

import { Button, PasswordField, PasswordStrengthMeter, Textfield, Checkbox } from '@astrosat/astrosat-ui';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import formStyles from './forms.module.css';
import registerStyles from './register-form.module.css';

const RegisterForm = ({ register }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);
  // const [redirectToLogin, setRedirectToLogin] = useState(false);

  function onSubmit() {
    register(values);
    // setRedirectToLogin(true);
  }

  // Re-direct to login.
  // if (redirectToLogin) {
  //   return <Redirect to="/login" />;
  // }

  return (
    <div className={formStyles.container}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <OrbisLogo className={formStyles.logo} />

        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <Textfield name="email" value={values.username || ''} placeholder="Email" onChange={handleChange} />
          </div>
          {errors.email && <p className={formStyles.errorMessage}>{errors.email}</p>}

          <div className={formStyles.row}>
            <PasswordField
              name="password1"
              value={values.password1 || ''}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          {errors.password1 && <p className={formStyles.errorMessage}> {errors.password1}</p>}

          <div className={formStyles.row}>
            <PasswordField
              name="password2"
              value={values.password2 || ''}
              onChange={handleChange}
              placeholder="Password Confirmation"
              required
            />
          </div>
          {errors.password2 && <p className={formStyles.errorMessage}>{errors.password2}</p>}

          <PasswordStrengthMeter password={values.password1} />
          <p>hello</p>

          <div className={`${formStyles.row} ${registerStyles.incidentals}`}>
            <ul>
              <li>No weak passwords</li>
              <li>At least 8 characters long</li>
              <li>Contains uppercase letters</li>
            </ul>
            <ul>
              <li>Contains numbers</li>
              <li>Not similar with email</li>
            </ul>
          </div>

          <div className={formStyles.row}>
            <Checkbox
              name="loggedIn"
              value="true"
              label="I agree with"
              onChange={() => console.log('Keep me logged in')}
            />
            &nbsp;<a href="http://google.co.uk">Terms &amp; Conditions</a>
          </div>
        </div>

        <div className={formStyles.buttons}>
          <Button
            type="submit"
            className={formStyles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Sign Up
          </Button>
        </div>

        <p className={registerStyles.footer}>
          Do you have an account?&nbsp;<Link to={'/login'}>Login</Link>
        </p>
      </form>
    </div>
  );
};

RegisterForm.propTypes = {
  register: PropTypes.func.isRequired
};

export default RegisterForm;
