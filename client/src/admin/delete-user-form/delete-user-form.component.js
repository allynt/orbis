import React from 'react';

import { Button, Link, Typography } from '@astrosat/astrosat-ui';

import { Form } from 'components';

export const DeleteUserForm = ({ user, deleteUser, close }) => {
  const handleClick = user => {
    deleteUser(user);
    close();
  };

  return (
    <Form>
      <Form.Row>
        <Typography>
          Do you really want to deactivate the <b>{user.user.name}</b> license
          and send deactivation email to the user’s email address?
        </Typography>
      </Form.Row>
      <Form.Row centered>
        <Button onClick={() => handleClick(user)}>Yes, Send</Button>
      </Form.Row>
      <Form.Row centered>
        <Link component="button" onClick={() => close()}>
          Cancel
        </Link>
      </Form.Row>
    </Form>
  );
};
