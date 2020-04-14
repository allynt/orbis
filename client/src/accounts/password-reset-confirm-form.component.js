import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import validate from './password-reset-confirm-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import PasswordField from '@astrosat/astrosat-ui/dist/forms/password-field';
import PasswordStrengthMeter from '@astrosat/astrosat-ui/dist/forms/password-strength-meter';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import { confirmChangePassword } from './accounts.actions';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import { LOGIN_URL, TERMS_URL } from './accounts.constants';

import formStyles from './forms.module.css';
import passwordStyles from './password-reset-confirm-form.module.css';

const PasswordResetConfirmForm = ({ match }) => {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);
  const dispatch = useDispatch();

  function onSubmit() {
    const data = {
      ...values,
      termsAgreed
    };
    dispatch(confirmChangePassword(data, match.params));
  }

  return (
    <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <OrbisLogo className={formStyles.logo} />

        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <PasswordField
              name="new_password1"
              value={values.new_password1 || ''}
              onChange={handleChange}
              placeholder="New Password"
              required
              autoFocus
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

          <PasswordStrengthMeter password={values.new_password1} />

          <div className={`${formStyles.row} ${passwordStyles.incidentals}`}>
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
            <Checkbox name="loggedIn" value="true" label="I agree with" onChange={() => setTermsAgreed(!termsAgreed)} />
            &nbsp;
            <Button theme="link" target="_blank" href={TERMS_URL}>
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
            Reset Password
          </Button>
        </div>

        <p className={passwordStyles.footer}>
          Do you have an account?&nbsp;
          <Button theme="link" href={LOGIN_URL}>
            Login
          </Button>
        </p>
      </form>
    </div>
  );
};

PasswordResetConfirmForm.propTypes = {
  match: PropTypes.object.isRequired
};

export default PasswordResetConfirmForm;
