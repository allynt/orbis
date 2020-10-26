import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import { Link } from 'react-router-dom';

import { LOGIN } from 'accounts/accounts.constants';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';

import styles from './resend-verification-email.module.css';

/**
 * @param {{
 *   email?: string
 *   isLoading?: boolean
 *   onResend?: (event: React.MouseEvent<HTMLButtonElement>) => void
 * }} props
 */
const ResendVerificationEmail = ({ email, isLoading = false, onResend }) => (
  <div className={styles.wrapper}>
    <h2 className={styles.heading}>Check your email</h2>
    <p className={styles.paragraph}>
      We have created an Astrosat ID for your email
      {email ? <b> {email}</b> : ''}. You should have received an email
      containing a validation link which will allow you to create your account.
    </p>
    <h2 className={styles.heading}>You haven’t received the email?</h2>
    <p className={styles.paragraph}>Please check your spam or bulk folders.</p>
    <Button className={styles.button} onClick={onResend}>
      {isLoading ? <LoadingSpinner /> : 'Resend email'}
    </Button>
    <Link className={styles.button} to={LOGIN}>
      <Button theme="link">Return to login</Button>
    </Link>
  </div>
);

export default ResendVerificationEmail;
