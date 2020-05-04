import React from 'react';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import { LOGIN_URL } from './accounts.constants';

import formStyles from './forms.module.css';

const PasswordResetDone = ({ error }) => (
  <div className={`${formStyles.container} ${formStyles.accountsBackground}`}>
    <div className={`${formStyles.form} ${formStyles.resend}`}>
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

      <p className={formStyles.paragraph}>
        Your password has successfully been reset. Click the button in order to continue.
      </p>

      <div className={formStyles.buttons}>
        <Button href={LOGIN_URL}>Continue</Button>
      </div>
    </div>
  </div>
);

export default PasswordResetDone;
