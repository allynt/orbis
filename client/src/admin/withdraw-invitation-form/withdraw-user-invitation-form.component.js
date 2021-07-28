import React from 'react';

import { Button, Grid, Link, Typography } from '@astrosat/astrosat-ui';

import { Form } from 'components';

/**
 * @param {{
 *   user?: import('typings').CustomerUser
 *   withdrawInvitation: (user: import('typings').CustomerUser) => void
 *   onCancelClick: () => void
 * }} props
 */
export const WithdrawUserInvitationForm = ({
  user,
  withdrawInvitation,
  onCancelClick,
}) => (
  <Grid container spacing={2}>
    <Form.Row component={Typography}>
      Do you really want to withdraw the pending invitation{' '}
      {!!user && (
        <>
          for <b>{user?.user.name}</b>
        </>
      )}{' '}
      and send email to the address about the act of withdrawal?
    </Form.Row>
    <Form.Row centered>
      <Button onClick={() => withdrawInvitation(user)}>Yes</Button>
    </Form.Row>
    <Form.Row centered>
      <Link component="button" onClick={() => onCancelClick()}>
        Cancel
      </Link>
    </Form.Row>
  </Grid>
);
