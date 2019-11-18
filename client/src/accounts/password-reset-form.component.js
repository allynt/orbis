import React from 'react';
import PropTypes from 'prop-types';

import useForm from '../hooks/useForm';
import validate from './password-reset-form.validator';

import { Button, Textfield } from '@astrosat/astrosat-ui';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import formStyles from './forms.module.css';
import passwordStyles from './password-reset-form.module.css';

const PasswordResetForm = ({ resetPassword }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    resetPassword(values);
  }

  return (
    <div className={formStyles.container}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <OrbisLogo className={formStyles.logo} />

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
        </div>

        <div className={formStyles.buttons}>
          <Button
            type="submit"
            className={formStyles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Reset Password
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

PasswordResetForm.propTypes = {
  resetPassword: PropTypes.func.isRequired
};

export default PasswordResetForm;
