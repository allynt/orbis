import React, { useState } from 'react';

import { Button, makeStyles, MenuItem, TableRow } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import {
  MissionControlTable,
  MissionControlTableCell,
} from 'mission-control/shared-components/mission-control-table/mission-control-table.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const useStyles = makeStyles(theme => ({
  resendButton: {
    padding: theme.spacing(1, 2),
  },
}));

/**
 * @param {{
 *   customerUser?: import('typings/orbis').CustomerUser
 *   customer?: import('typings/orbis').Customer
 *   onResendInvitationClick?: () => void
 *   onWithdrawInvitationClick?: () => void
 * }} props
 */
const PendingUserRow = ({
  customerUser,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const styles = useStyles({});
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
      <MissionControlTableCell>
        {customerUser.user.name}
      </MissionControlTableCell>
      <MissionControlTableCell>
        {customerUser.user.email}
      </MissionControlTableCell>
      <MissionControlTableCell>
        {getLicenceInfo(licences)}
      </MissionControlTableCell>
      <MissionControlTableCell>{date}</MissionControlTableCell>
      <MissionControlTableCell>
        <Button
          className={styles.resendButton}
          size="small"
          onClick={handleResendClick}
        >
          Resend Invitation
        </Button>
      </MissionControlTableCell>
      <MissionControlTableCell padding="checkbox">
        <OptionsMenu
          anchorEl={optionsAnchorEl}
          onButtonClick={handleOptionsButtonClick}
          onClose={handleOptionsMenuClose}
        >
          <MenuItem onClick={handleWithdrawClick}>Withdraw</MenuItem>
        </OptionsMenu>
      </MissionControlTableCell>
    </TableRow>
  );
};

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
  const columnHeaders = [
    'Pending Invitations',
    'Email',
    'Licence Type',
    'Invitation Sent',
    'Invited',
  ].map(column => (
    <MissionControlTableCell key={column} align="left">
      {column}
    </MissionControlTableCell>
  ));

  const rows = pendingUsers?.map(user => (
    <PendingUserRow
      key={user.user.id}
      customerUser={user}
      customer={customer}
      onResendInvitationClick={() => onResendInvitationClick(user)}
      onWithdrawInvitationClick={() => onWithdrawInvitationClick(user)}
    />
  ));

  return (
    <MissionControlTable
      rows={rows}
      columnHeaders={columnHeaders}
      noDataMessage="No Pending Users"
    />
  );
};
