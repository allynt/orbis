import React, { useState } from 'react';

import { format } from 'date-fns';

import {
  Button,
  OptionsIcon,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import OptionsDropdown from '../options-dropdown/options-dropdown.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';

import styles from './pending-invitations.module.css';
import tableStyles from '../../table.module.css';
import { AdminTableCell } from 'admin/admin-table/admin-table-cell.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const TableHeader = () => (
  <TableHead>
    <TableRow>
      <AdminTableCell align="left">Pending Invitations</AdminTableCell>
      <AdminTableCell align="left">Email</AdminTableCell>
      <AdminTableCell align="left">Licence Type</AdminTableCell>
      <AdminTableCell align="left">Invitation Sent</AdminTableCell>
      <AdminTableCell align="left">Invited</AdminTableCell>
      <AdminTableCell align="left">&nbsp;</AdminTableCell>
    </TableRow>
  </TableHead>
);

const PendingUserRow = ({
  user,
  dropdown,
  customer,
  onResendInvitationClick,
  setDropdown,
  onWithdrawInvitationClick,
}) => {
  const selected = dropdown === user;
  const date = format(new Date(user.invitation_date), DATE_FORMAT);
  let licences = null;
  if (customer && customer.licences) {
    licences = getUserLicences(user, customer);
  }
  return (
    <TableRow>
      <AdminTableCell>{user.user.name}</AdminTableCell>
      <AdminTableCell>{user.user.email}</AdminTableCell>
      <AdminTableCell>{getLicenceInfo(licences)}</AdminTableCell>
      <AdminTableCell>{date}</AdminTableCell>
      <AdminTableCell>
        <Button
          className={styles.resendInvitation}
          size="small"
          onClick={() => {
            onResendInvitationClick(user);
          }}
        >
          Resend Invitation
        </Button>
      </AdminTableCell>
      <AdminTableCell>
        <OptionsIcon
          data-testid="options-icon"
          onClick={() => setDropdown(selected ? null : user)}
        />
        {selected && (
          <OptionsDropdown
            className={styles.withdrawDropdown}
            onClickAway={() => setDropdown(null)}
          >
            <button
              className={tableStyles.optionsButton}
              onClick={() => {
                onWithdrawInvitationClick(user);
                setDropdown(null);
              }}
            >
              Withdraw
            </button>
          </OptionsDropdown>
        )}
      </AdminTableCell>
    </TableRow>
  );
};

export const PendingInvitationsBoard = ({
  pendingUsers,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const [dropdown, setDropdown] = useState(null);

  return (
    <Table>
      <TableHeader />
      <TableBody>
        {pendingUsers && pendingUsers.length > 0 ? (
          pendingUsers.map(user => (
            <PendingUserRow
              key={user.id}
              customer={customer}
              dropdown={dropdown}
              onResendInvitationClick={onResendInvitationClick}
              onWithdrawInvitationClick={onWithdrawInvitationClick}
              setDropdown={setDropdown}
              user={user}
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
};
