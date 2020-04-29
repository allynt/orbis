import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import { LOGIN_URL } from './accounts.constants';

import formStyles from './forms.module.css';
import styles from './password-reset-form.module.css';

const AccountActivation = ({ match, error, activateAccount, accountActivationSuccessful }) => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    activateAccount({ key: match.params.key });
    setRedirectToLogin(true);
  }, [activateAccount, match]);

  // Re-direct to login if account activation is successful, show error if not
  if (redirectToLogin && accountActivationSuccessful) {
    return <Redirect to={LOGIN_URL} />;
  }
  return (
    <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
      <div className={`${formStyles.form} ${styles.resend}`}>
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

        <p className={styles.paragraph}>Sorry, there was an error in activating your account.</p>
        <p className={styles.paragraph}>Please try again later.</p>

        <div className={styles.buttons}>
          <Button href={LOGIN_URL}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
AccountActivation.propTypes = {
  match: PropTypes.object.isRequired,
};

=======
>>>>>>> 293d6be... fix(frontend): Make requested changes 1
export default AccountActivation;
