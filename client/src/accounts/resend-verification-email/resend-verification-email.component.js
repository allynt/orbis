import React from 'react';

import formStyles from 'forms.module.css';
import { Button } from '@astrosat/astrosat-ui';
import { Link } from 'react-router-dom';
import { LOGIN_URL } from 'accounts/accounts.constants';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';

/**
 * @param {{
 *   email?: string
 *   isLoading?: boolean
 *   resendVerificationEmail: (event: React.MouseEvent<HTMLButtonElement>) => void
 * }} props
 */
export const ResendVerificationEmail = ({
  email,
  isLoading = false,
  resendVerificationEmail,
}) => (
  <div className={formStyles.form}>
    <div className={formStyles.textContent}>
      <p className={formStyles.paragraph}>
        <strong>Check your email</strong>
      </p>

      <p className={formStyles.paragraph}>
        An email has been sent to <strong>{email}</strong>. Please click the
        link inside to verify your account before logging in.
      </p>

      <p className={formStyles.paragraph}>
        <strong>You haven't received the email?</strong>
      </p>

      <p className={formStyles.paragraph}>
        Please check your spam or bulk folders.
      </p>
    </div>

    <div className={formStyles.buttons}>
      <Button onClick={resendVerificationEmail}>
        {isLoading ? <LoadingSpinner /> : 'Resend email'}
      </Button>
      <Link to={LOGIN_URL}>
        <Button theme="link">Continue</Button>
      </Link>
    </div>
  </div>
);
