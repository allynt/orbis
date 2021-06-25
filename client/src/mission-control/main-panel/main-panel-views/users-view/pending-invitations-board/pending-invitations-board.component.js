import React from 'react';

import { Box, makeStyles } from '@astrosat/astrosat-ui';

import { PendingUsersGridTable } from './pending-users-grid-table.component';

const useStyles = makeStyles(theme => ({
  container: {
    maxHeight: `calc(100% - ${theme.spacing(10)})`,
  },
}));

/**
 * @param {{
 *   pendingUsers?: import('typings/orbis').CustomerUser[]
 *   customer?: import('typings/orbis').Customer
 *   onResendInvitationClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 *   onWithdrawInvitationClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 * }} props
 */
export const PendingInvitationsBoard = ({
  pendingUsers,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const styles = useStyles();
  return (
    <Box
      className={styles.container}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      <PendingUsersGridTable
        pendingUsers={pendingUsers}
        customer={customer}
        onResendInvitationClick={user => onResendInvitationClick(user)}
        onWithdrawInvitationClick={user => onWithdrawInvitationClick(user)}
      />
    </Box>
  );
};
