import React, { useState, useEffect } from 'react';

import { Redirect } from 'react-router-dom';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import { status } from './accounts.slice';

import { LOGIN_URL } from './accounts.constants';

import formStyles from './forms.module.css';

const AccountActivation = ({ match, error, activateAccount, accountActivationStatus }) => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    activateAccount({ key: match.params.key });
    setRedirectToLogin(true);
  }, [activateAccount, match]);

  // Re-direct to login if account activation is successful, show error if not
  if (redirectToLogin && accountActivationStatus === status.COMPLETE) {
    return <Redirect to={LOGIN_URL} />;
  }
  return (
    <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
      <div className={formStyles.form}>
        <OrbisLogo className={formStyles.logo} />

        {error && (
          <Well type="error">
            <ul data-testid="error-well">
              {error.map(error => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </Well>
        )}

        <div className={formStyles.content}>
          <p className={formStyles.paragraph}>Sorry, there was an error in activating your account.</p>
          <p className={formStyles.paragraph}>Please try again later.</p>
        </div>

        <div className={formStyles.buttons}>
          <Button href={LOGIN_URL}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default AccountActivation;
