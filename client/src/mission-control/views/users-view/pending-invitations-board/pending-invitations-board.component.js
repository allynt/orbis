import React, { useMemo } from 'react';

import { Button, makeStyles, MenuItem } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import { OptionsMenu } from 'components/options-menu/options-menu.component';
import { Table } from 'mission-control/shared-components/mission-control-table';

import { getLicenceInfo, getUserLicences } from '../../licence-utils';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const useStyles = makeStyles(theme => ({
  resendButton: {
    padding: theme.spacing(1, 2),
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
  const columns = useMemo(
    () => [
      {
        Header: 'Pending Invitations',
        accessor: 'user.name',
      },
      {
        Header: 'Email',
        accessor: 'user.email',
      },
      {
        Header: 'Licence Type',
        id: 'licences',
        accessor: customerUser => {
          let licences = null;
          if (customer && customer.licences) {
            licences = getUserLicences(customerUser, customer);
          }
          return getLicenceInfo(licences);
        },
      },
      {
        Header: 'Invitation Sent',
        accessor: 'invitation_date',
        Cell: ({ value }) => format(new Date(value), DATE_FORMAT),
      },
      {
        Header: 'Invited',
        id: 'resend',
        accessor: v => v,
        Cell: ({ value: customerUser }) => (
          <Button
            className={styles.resendButton}
            size="small"
            onClick={() => onResendInvitationClick(customerUser)}
          >
            Resend Invitation
          </Button>
        ),
      },
      {
        id: 'options',
        accessor: v => v,
        Cell: ({ value: customerUser }) => (
          <OptionsMenu>
            <MenuItem
              onClick={() => {
                onWithdrawInvitationClick(customerUser);
              }}
            >
              Withdraw
            </MenuItem>
          </OptionsMenu>
        ),
      },
    ],
    [
      customer,
      onResendInvitationClick,
      onWithdrawInvitationClick,
      styles.resendButton,
    ],
  );
  const data = useMemo(() => pendingUsers ?? [], [pendingUsers]);

  return (
    <Table
      columns={columns}
      data={data}
      noDataMessage="No Pending Users"
      getCellProps={cell => ({
        padding: cell.column.id === 'options' ? 'checkbox' : 'inherit',
      })}
    />
  );
};
