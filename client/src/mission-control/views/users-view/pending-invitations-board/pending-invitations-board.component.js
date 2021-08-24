import React, { useState } from 'react';

import {
  Button,
  makeStyles,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import { MissionControlTableCell } from 'mission-control/shared-components/mission-control-table/mission-control-table.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const NameCell = ({ name }) => (
  <MissionControlTableCell>{name}</MissionControlTableCell>
);

const EmailCell = ({ email }) => (
  <MissionControlTableCell>{email}</MissionControlTableCell>
);

const LicencesCell = ({ customer, customerUser }) => {
  let licences = null;
  if (customer && customer.licences) {
    licences = getUserLicences(customerUser, customer);
  }
  return (
    <MissionControlTableCell>
      {getLicenceInfo(licences)}
    </MissionControlTableCell>
  );
};

const DateCell = ({ invitationDate }) => (
  <MissionControlTableCell>
    {format(new Date(invitationDate), DATE_FORMAT)}
  </MissionControlTableCell>
);

const useStyles = makeStyles(theme => ({
  resendButton: {
    padding: theme.spacing(1, 2),
  },
}));
const ResendCell = ({ onClick }) => {
  const styles = useStyles();
  return (
    <MissionControlTableCell>
      <Button className={styles.resendButton} size="small" onClick={onClick}>
        Resend Invitation
      </Button>
    </MissionControlTableCell>
  );
};

const OptionsCell = ({ onWithdrawInvitationClick }) => {
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);

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
    <MissionControlTableCell padding="checkbox">
      <OptionsMenu
        anchorEl={optionsAnchorEl}
        onButtonClick={handleOptionsButtonClick}
        onClose={handleOptionsMenuClose}
      >
        <MenuItem onClick={handleWithdrawClick}>Withdraw</MenuItem>
      </OptionsMenu>
    </MissionControlTableCell>
  );
};

const useTableStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
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
  const styles = useTableStyles();
  return (
    <Table className={styles.table}>
      <TableHead>
        {[
          'Pending Invitations',
          'Email',
          'Licence Type',
          'Invitation Sent',
          'Invited',
        ].map(column => (
          <MissionControlTableCell key={column}>
            {column}
          </MissionControlTableCell>
        ))}
      </TableHead>
      <TableBody>
        {pendingUsers?.map(user => (
          <TableRow key={user.id}>
            <NameCell name={user.user.name} />
            <EmailCell email={user.user.email} />
            <LicencesCell customer={customer} customerUser={user} />
            <DateCell invitationDate={user.invitation_date} />
            <ResendCell onClick={() => onResendInvitationClick(user)} />
            <OptionsCell
              onWithdrawInvitationClick={() => onWithdrawInvitationClick(user)}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
