import React, { useState } from 'react';

import { format } from 'date-fns';

import {
  Button,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { AdminTableCell } from 'admin/admin-table/admin-table-cell.component';
import { OptionsMenu } from '../options-menu/options-menu.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const TableHeader = () => (
  <TableHead>
    <TableRow>
      <AdminTableCell align="left">Pending Invitations</AdminTableCell>
      <AdminTableCell align="left">Email</AdminTableCell>
      <AdminTableCell align="left">Licence Type</AdminTableCell>
      <AdminTableCell align="left">Invitation Sent</AdminTableCell>
      <AdminTableCell align="left">Invited</AdminTableCell>
      <AdminTableCell align="left" />
    </TableRow>
  </TableHead>
);

const PendingUserRow = ({
  user,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);
  const date = format(new Date(user.invitation_date), DATE_FORMAT);
  let licences = null;
  if (customer && customer.licences) {
    licences = getUserLicences(user, customer);
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
      <AdminTableCell>{user.user.name}</AdminTableCell>
      <AdminTableCell>{user.user.email}</AdminTableCell>
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

export const PendingInvitationsBoard = ({
  pendingUsers,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => (
  <Table>
    <TableHeader />
    <TableBody>
      {pendingUsers && pendingUsers.length > 0 ? (
        pendingUsers.map(user => (
          <PendingUserRow
            key={user.id}
            user={user}
            customer={customer}
            onResendInvitationClick={() => onResendInvitationClick(user)}
            onWithdrawInvitationClick={() => onWithdrawInvitationClick(user)}
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
);
