import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import styles from './withdraw-user-invitation-form.module.css';

export const WithdrawUserInvitationForm = ({
  user,
  withdrawInvitation,
  close,
}) => {
  const handleClick = e => {
    e.preventDefault();
    withdrawInvitation(user);
    close();
  };
  return (
    <div className={styles.form}>
      <p className={styles.message}>
        Do you really want to withdraw the pending{' '}
        <strong>{user.user.name}</strong> license and send email to the address
        about the act of withdrawal?
      </p>
      <div className={styles.buttons}>
        <Button onClick={handleClick}>Yes</Button>
        <Button theme="link" onClick={() => close()}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
