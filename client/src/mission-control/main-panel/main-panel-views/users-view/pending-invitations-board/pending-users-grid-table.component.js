import React, { useState } from 'react';
import { Button, MenuItem, makeStyles, styled } from '@astrosat/astrosat-ui';
import { DataGrid } from '@material-ui/data-grid';
import { format } from 'date-fns';
import { getLicenceInfo, getUserLicences } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const Wrapper = styled('div')(() => ({
  width: '100%',
}));

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    borderRadius: '0.25rem',
  },
  row: {
    maxHeight: 'none !important',
  },
  button: {
    padding: '0.65em 2em',
    minWidth: '11em',
  },
}));

export const PendingUsersGridTable = ({
  customer,
  pendingUsers,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const styles = useStyles({});

  const ResendInvitationActions = ({ customerUser }) => {
    return (
      <Button
        size="small"
        onClick={() => onResendInvitationClick(customerUser)}
      >
        Resend Invitation
      </Button>
    );
  };

  const UserOptionsActions = ({ customerUser }) => {
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

    const handleWithdrawClick = customerUser => {
      onWithdrawInvitationClick(customerUser);
      setOptionsAnchorEl(null);
    };

    return (
      <OptionsMenu
        anchorEl={optionsAnchorEl}
        onButtonClick={handleOptionsButtonClick}
        onClose={handleOptionsMenuClose}
      >
        <MenuItem onClick={() => handleWithdrawClick(customerUser)}>
          Withdraw
        </MenuItem>
      </OptionsMenu>
    );
  };

  // Determines columns to show in table
  const columns = [
    {
      field: 'pendingInvitations',
      headerName: 'Pending Invitations',
      width: 213,
    },
    { field: 'email', headerName: 'Email', width: 213 },
    {
      field: 'licence',
      headerName: 'Licence',
      width: 213,
    },
    { field: 'invitationSent', headerName: 'Invitation Sent', width: 213 },
    {
      field: 'resendInvitationActions',
      headerName: 'Invited',
      width: 213,
      renderCell: ({ row }) => (
        <ResendInvitationActions
          customerUser={pendingUsers?.find(u => u.id === row.id)}
        />
      ),
    },
    {
      field: 'userOptionsActions',
      headerName: 'Withdraw Invitation',
      width: 213,
      renderCell: ({ row }) => (
        <UserOptionsActions
          customerUser={pendingUsers?.find(u => u.id === row.id)}
        />
      ),
    },
  ];

  // Array of data objects to be mapped to columns specified above
  const rows = pendingUsers?.map(customerUser => {
    const licences =
      customer && customer.licences
        ? getUserLicences(customerUser, customer)
        : null;

    return {
      id: customerUser?.id,
      pendingInvitations: customerUser?.user?.name,
      licence: getLicenceInfo(licences),
      invitationSent: format(
        new Date(customerUser.invitation_date),
        DATE_FORMAT,
      ),
      email: customerUser?.user?.email,
    };
  });

  return (
    <Wrapper>
      <DataGrid
        autoHeight
        rows={pendingUsers?.length ? rows : []}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        classes={styles}
      />
    </Wrapper>
  );
};
