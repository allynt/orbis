import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import validate from './register-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import PasswordField from '@astrosat/astrosat-ui/dist/forms/password-field';
import PasswordStrengthMeter from '@astrosat/astrosat-ui/dist/forms/password-strength-meter';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import { register } from './accounts.actions';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import formStyles from './forms.module.css';
import registerStyles from './register-form.module.css';

const RegisterForm = () => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);
  const dispatch = useDispatch();
  const error = useSelector(state => state.accounts.error);
  const config = useSelector(state => state.app.config);

  function onSubmit() {
    dispatch(register(values));
  }

  return (
    <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <OrbisLogo className={formStyles.logo} />

        {config && !config.isRegistrationOpen && (
          <Well type="error">
            <div>We are sorry, but the signup is currently closed.</div>
          </Well>
        )}

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
              name="password1"
              value={values.password1 || ''}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          {errors.password1 && <p className={formStyles.errorMessage}> {errors.password1}</p>}

          <div className={formStyles.passwordStrengthMeter}>
            <PasswordStrengthMeter password={values.password1} />
          </div>

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

          <div className={`${formStyles.row} ${registerStyles.incidentals}`}>
            <ul>
              {config && config.passwordStrength >= 2 && <li>No weak passwords</li>}
              {config && <li>At least {config.passwordMinLength} characters long</li>}
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
            &nbsp;
            <Button theme="link" href="http://google.co.uk">
              Terms &amp; Conditions
            </Button>
          </div>
        </div>

        <div className={formStyles.buttons}>
          <Button
            type="submit"
            className={formStyles.button}
            disabled={
              (config && !config.isRegistrationOpen) ||
              Object.keys(errors).length > 0 ||
              Object.keys(values).length === 0
            }
          >
            Sign Up
          </Button>
        </div>

        <p className={registerStyles.footer}>
          Do you have an account?&nbsp;
          <Button theme="link" href="/login">
            Login
          </Button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
