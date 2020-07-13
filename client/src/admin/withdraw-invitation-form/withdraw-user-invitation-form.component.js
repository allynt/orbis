import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import formStyles from '../../forms.module.css';

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
    <div className={formStyles.form}>
      <p>
        Do you really want to withdraw the pending{' '}
        <strong>{user.user.name}</strong> license and send email to the address
        about the act of withdrawal?
      </p>
      <div className={formStyles.buttons}>
        <Button onClick={handleClick}>Yes</Button>
        <Button
          theme="link"
          className={formStyles.button}
          onClick={() => close()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
