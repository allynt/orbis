import React, { useState } from 'react';

import {
  Button,
  makeStyles,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import { AdminTableCell } from 'admin/admin-table/admin-table-cell.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const TableHeader = () => (
  <TableHead>
    <TableRow>
      <AdminTableCell align="left">Pending Invitations</AdminTableCell>
      <AdminTableCell align="left">Email</AdminTableCell>
      <AdminTableCell align="left">Licence Type</AdminTableCell>
      <AdminTableCell align="left">Invitation Sent</AdminTableCell>
      <AdminTableCell align="left">Invited</AdminTableCell>
    </TableRow>
  </TableHead>
);

/**
 * @param {{
 *   customerUser?: import('typings').CustomerUser
 *   customer?: import('typings').Customer
 *   onResendInvitationClick?: () => void
 *   onWithdrawInvitationClick?: () => void
 * }} params
 */
const PendingUserRow = ({
  customerUser,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);
  const date = format(new Date(customerUser.invitation_date), DATE_FORMAT);
  let licences = null;
  if (customer && customer.licences) {
    licences = getUserLicences(customerUser, customer);
  }

  const handleResendClick = () => {
    onResendInvitationClick();
  };

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
   */
  const handleOptionsButtonClick = e => {
    setOptionsAnchorEl(e.currentTarget);
  };

  const handleOptionsMenuClose = () => {
    setOptionsAnchorEl(null);
  };

  const handleWithdrawClick = () => {
    onWithdrawInvitationClick();
    setOptionsAnchorEl(null);
  };

  return (
    <TableRow>
      <AdminTableCell>{customerUser.user.name}</AdminTableCell>
      <AdminTableCell>{customerUser.user.email}</AdminTableCell>
      <AdminTableCell>{getLicenceInfo(licences)}</AdminTableCell>
      <AdminTableCell>{date}</AdminTableCell>
      <AdminTableCell>
        <Button size="small" onClick={handleResendClick}>
          Resend Invitation
        </Button>
      </AdminTableCell>
      <AdminTableCell>
        <OptionsMenu
          anchorEl={optionsAnchorEl}
          onButtonClick={handleOptionsButtonClick}
          onClose={handleOptionsMenuClose}
        >
          <MenuItem onClick={handleWithdrawClick}>Withdraw</MenuItem>
        </OptionsMenu>
      </AdminTableCell>
    </TableRow>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    maxHeight: `calc(100% - ${theme.spacing(10)})`,
  },
}));

/**
 * @param {{
 *   pendingUsers?: import('typings').CustomerUser[]
 *   customer?: import('typings').Customer
 *   onResendInvitationClick?: (customerUser: import('typings').CustomerUser) => void
 *   onWithdrawInvitationClick?: (customerUser: import('typings').CustomerUser) => void
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
    <TableContainer className={styles.container}>
      <Table stickyHeader>
        <TableHeader />
        <TableBody>
          {pendingUsers && pendingUsers.length > 0 ? (
            pendingUsers.map(user => (
              <PendingUserRow
                key={user.id}
                customerUser={user}
                customer={customer}
                onResendInvitationClick={() => onResendInvitationClick(user)}
                onWithdrawInvitationClick={() =>
                  onWithdrawInvitationClick(user)
                }
              />
            ))
          ) : (
            <TableRow>
              <AdminTableCell align="center" colSpan={6}>
                No Pending Users
              </AdminTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
