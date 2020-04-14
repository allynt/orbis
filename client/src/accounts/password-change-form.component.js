import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import { changePassword } from './accounts.actions';

import validate from './password-change-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import PasswordField from '@astrosat/astrosat-ui/dist/forms/password-field';
import PasswordStrengthMeter from '@astrosat/astrosat-ui/dist/forms/password-strength-meter';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import formStyles from './forms.module.css';
import passwordStyles from './password-change-form.module.css';

const PasswordChangeForm = () => {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);
  const dispatch = useDispatch();

  function onSubmit() {
    dispatch(changePassword(values));
  }

  return (
    <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <OrbisLogo className={formStyles.logo} />

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
            <Button theme="link" href="/terms">
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

        <p className={passwordStyles.footer}>
          Do you have an account?&nbsp;
          <Button theme="link" href="/login">
            Login
          </Button>
        </p>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
