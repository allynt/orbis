import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import validate from './register-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import PasswordField from '@astrosat/astrosat-ui/dist/forms/password-field';
import PasswordStrengthMeter from '@astrosat/astrosat-ui/dist/forms/password-strength-meter';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import { status } from './accounts.slice';

import { LOGIN_URL, TERMS_URL } from './accounts.constants';

import formStyles from './forms.module.css';

const RegisterForm = ({ register, error, registerUserStatus }) => {
  const { passwordMinLength, passwordMaxLength } = useSelector(state => state.app.config);
  const validators = {
    passwordMinLength,
    passwordMaxLength,
  };
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate, validators);

  const config = useSelector(state => state.app.config);

  const [termsAgreed, setTermsAgreed] = useState(false);

  function onSubmit() {
    const data = {
      ...values,
      accepted_terms: termsAgreed,
    };
    register(data);
  }

  return (
    <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
      {registerUserStatus === status.PENDING ? (
        <div className={`${formStyles.form} ${formStyles.resend}`}>
          <OrbisLogo className={formStyles.logo} />
          CHECK YOUR EMAIL STUFF GOES HERE
          <p className={formStyles.paragraph}>
            Thank you! An email has been sent to <strong>{values.email}</strong>
          </p>
          <p className={formStyles.paragraph}>Please click the link inside to verify your account before logging in.</p>
          <div className={formStyles.buttons}>
            <Button href="/login">Continue</Button>
          </div>
        </div>
      ) : (
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <OrbisLogo className={formStyles.logo} />

          {config && !config.isRegistrationOpen && (
            <Well type="error">
              <div>We are sorry, but the signup is currently closed.</div>
            </Well>
          )}

          {error && (
            <Well type="error">
              <ul>
                {error.map(error => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
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

            <div className={`${formStyles.row} ${formStyles.incidentals}`}>
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
                label="I agree with"
                value="true"
                onChange={() => setTermsAgreed(!termsAgreed)}
              />
              &nbsp;
              <Button theme="link" target="_blank" href={TERMS_URL} rel="noopener noreferrer">
                Terms &amp; Conditions
              </Button>
            </div>
          </div>
          <div className={formStyles.buttons}>
            <Button
              type="submit"
              className={formStyles.button}
              disabled={
                !termsAgreed ||
                (config && !config.isRegistrationOpen) ||
                Object.keys(errors).length > 0 ||
                Object.keys(values).length === 0
              }
            >
              Sign Up
            </Button>
          </div>
          <p className={formStyles.footer}>
            Do you have an account?&nbsp;
            <Button theme="link" href={LOGIN_URL}>
              Login
            </Button>
          </p>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
