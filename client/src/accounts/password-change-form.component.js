import React, { useState } from 'react';

import validate from './password-change-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import PasswordField from '@astrosat/astrosat-ui/dist/forms/password-field';
import PasswordStrengthMeter from '@astrosat/astrosat-ui/dist/forms/password-strength-meter';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import { status } from './accounts.slice';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import { LOGIN_URL, TERMS_URL } from './accounts.constants';

import formStyles from './forms.module.css';

const ChangePasswordSuccessView = () => (
  <div className={`${formStyles.form} ${formStyles.resend}`}>
    <OrbisLogo className={formStyles.logo} />
    <p className={formStyles.paragraph}>Thank you! Your password has been changed.</p>
    <p className={formStyles.paragraph}>
      You have completed your OR3IS account. Click the button in order to continue.
    </p>

    <div className={formStyles.buttons}>
      <Button href={LOGIN_URL}>Continue</Button>
    </div>
  </div>
);

const PasswordChangeForm = ({ changePassword, changeStatus, error }) => {
  const [termsAgreed, setTermsAgreed] = useState(false);
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    const data = {
      ...values,
      accepted_terms: termsAgreed,
    };
    changePassword(data);
  }

  return (
    <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
      {changeStatus === status.PENDING ? (
        <ChangePasswordSuccessView />
      ) : (
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <OrbisLogo className={formStyles.logo} />

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
              <PasswordField
                name="old_password"
                value={values.old_password || ''}
                onChange={handleChange}
                placeholder="Old Password"
                required
                autoFocus
              />
            </div>
            {errors.old_password && <p className={formStyles.errorMessage}>{errors.old_password}</p>}

            <div className={formStyles.row}>
              <PasswordField
                name="new_password1"
                value={values.new_password1 || ''}
                onChange={handleChange}
                placeholder="New Password"
                required
              />
            </div>
            {errors.new_password1 && <p className={formStyles.errorMessage}>{errors.new_password1}</p>}

            <div className={formStyles.row}>
              <PasswordField
                name="new_password2"
                value={values.new_password2 || ''}
                onChange={handleChange}
                placeholder="New Password Confirmation"
                required
              />
            </div>
            {errors.new_password2 && <p className={formStyles.errorMessage}>{errors.new_password2}</p>}

            <PasswordStrengthMeter password={values.password1} />

            <div className={`${formStyles.row} ${formStyles.incidentals}`}>
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
                onChange={() => setTermsAgreed(!termsAgreed)}
              />
              &nbsp;
              <Button theme="link" target="_blank" rel="noopener noreferrer" href={TERMS_URL}>
                Terms &amp; Conditions
              </Button>
            </div>
          </div>

          <div className={formStyles.buttons}>
            <Button
              type="submit"
              className={formStyles.button}
              disabled={!termsAgreed || Object.keys(errors).length > 0 || Object.keys(values).length === 0}
            >
              Change Password
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

export default PasswordChangeForm;
