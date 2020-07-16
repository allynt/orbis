import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import styles from './delete-user-form.module.css';

export const DeleteUserForm = ({ user, deleteCustomerUser, close }) => {
  const handleClick = user => {
    deleteCustomerUser(user);
    close();
  };

  return (
    <div className={styles.form}>
      <p className={styles.message}>
        Do you really want to deactivate the <strong>{user.user.name}</strong>{' '}
        license and send deactivation email to the user’s email address?
      </p>
      <div className={styles.buttons}>
        <Button onClick={() => handleClick(user)}>Yes, Send</Button>
        <Button theme="link" onClick={() => close()}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
