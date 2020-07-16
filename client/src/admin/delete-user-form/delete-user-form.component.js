import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

export const DeleteUserForm = ({ user, deleteCustomerUser, close }) => {
  const handleClick = user => {
    deleteCustomerUser(user);
    close();
  };

  return (
    <div>
      <p>
        Do you really want to deactivate the {user.user.name} license and send
        deactivation email to the user’s email address?
      </p>
      <Button onClick={() => handleClick(user)}>Close</Button>
      <Button onClick={() => close()}>Cancel</Button>
    </div>
  );
};
