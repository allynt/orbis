import { Button } from '@astrosat/astrosat-ui';
import React from 'react';
import styles from './user-registration-success.module.css';

/**
 * @param {{
 *   email?: string
 *   onResend?: (event: React.MouseEvent<HTMLButtonElement>) => void
 * }} props
 */
const UserRegistrationSuccess = ({ email, onResend }) => (
  <div className={styles.wrapper}>
    <h2 className={styles.heading}>Check your email</h2>
    <p className={styles.paragraph}>
      We have created an Astrosat ID for your email
      {email ? <span className={styles.email}> {email}</span> : ''}. You should
      now receive an email containing a validation link which will allow you to
      create your account.
    </p>
    <h2 className={styles.heading}>You haven’t received the email?</h2>
    <p className={styles.paragraph}>Please check your spam or bulk folders.</p>
    <Button className={styles.button} onClick={onResend}>
      Resend Email
    </Button>
  </div>
);

export default UserRegistrationSuccess;
