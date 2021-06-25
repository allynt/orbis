import React, { useState } from 'react';
import {
  Button,
  TriangleIcon,
  Menu,
  MenuItem,
  makeStyles,
  styled,
} from '@astrosat/astrosat-ui';
import { DataGrid } from '@material-ui/data-grid';
import { getLicenceInfo, getUserLicences } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';
import { ADMIN_STATUS } from 'mission-control/mission-control.constants';

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

const USER_LABELS = {
  standard: 'Standard',
  admin: 'Admin',
};

export const ActiveUsersGridTable = ({
  customer,
  activeCustomerUsers,
  currentUser,
  oneAdminRemaining,
  handleDeleteClick,
  handleEditClick,
  handleRoleClick,
}) => {
  const styles = useStyles({});
  const AdminStatusActions = ({ customerUser }) => {
    const [roleAnchorEl, setRoleAnchorEl] = useState(null);

    /**
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
     */
    const handleRoleButtonClick = e => {
      setRoleAnchorEl(e.currentTarget);
    };

    const handleRoleMenuClose = () => {
      setRoleAnchorEl(null);
    };

    const onRoleClick = customerUser => {
      handleRoleClick(customerUser);
      setRoleAnchorEl(null);
    };

    return (
      <>
        <Button
          aria-controls="role-menu"
          color="secondary"
          className={styles.button}
          onClick={handleRoleButtonClick}
          disabled={
            customerUser.type === ADMIN_STATUS.manager && oneAdminRemaining
          }
          size="small"
          endIcon={<TriangleIcon style={{ transform: 'rotate(180deg)' }} />}
        >
          {customerUser.type === ADMIN_STATUS.manager
            ? USER_LABELS.admin
            : USER_LABELS.standard}
        </Button>
        <Menu
          id="role-menu"
          anchorEl={roleAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={!!roleAnchorEl}
          onClose={handleRoleMenuClose}
        >
          <MenuItem onClick={() => onRoleClick(customerUser)}>
            {customerUser.type === ADMIN_STATUS.manager
              ? USER_LABELS.standard
              : USER_LABELS.admin}
          </MenuItem>
        </Menu>
      </>
    );
  };

  const EditButtonActions = ({ customerUser }) => {
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

    const onEditClick = customerUser => {
      handleEditClick(customerUser);
      setOptionsAnchorEl(null);
    };

    const onDeleteClick = customerUser => {
      handleDeleteClick(customerUser);
      setOptionsAnchorEl(null);
    };

    return (
      <OptionsMenu
        anchorEl={optionsAnchorEl}
        onButtonClick={handleOptionsButtonClick}
        onClose={handleOptionsMenuClose}
      >
        <MenuItem onClick={() => onEditClick(customerUser)}>Edit</MenuItem>
        {customerUser?.user?.id !== currentUser?.id && (
          <MenuItem onClick={() => onDeleteClick(customerUser)}>
            Delete User
          </MenuItem>
        )}
      </OptionsMenu>
    );
  };

  // Determines columns to show in table
  const columns = [
    {
      field: 'user',
      headerName: 'User',
      width: 213,
    },
    { field: 'email', headerName: 'Email', width: 213 },
    {
      field: 'licence',
      headerName: 'Licence',
      width: 213,
    },
    { field: 'type', headerName: 'Type', width: 213 },
    {
      field: 'adminStatusActions',
      headerName: 'Update user status',
      width: 213,
      renderCell: ({ row }) => (
        <AdminStatusActions
          customerUser={activeCustomerUsers?.find(u => u.id === row.id)}
        />
      ),
    },
    {
      field: 'editButtonActions',
      headerName: 'Edit user',
      width: 213,
      renderCell: ({ row }) => (
        <EditButtonActions
          customerUser={activeCustomerUsers?.find(u => u.id === row.id)}
        />
      ),
    },
  ];

  // Array of data objects to be mapped to columns specified above
  const rows = activeCustomerUsers?.map(customerUser => {
    const licences =
      customer && customer.licences
        ? getUserLicences(customerUser, customer)
        : null;

    return {
      id: customerUser?.id,
      user: customerUser?.user?.name,
      licence: getLicenceInfo(licences),
      type: customerUser?.type,
      email: customerUser?.user?.email,
    };
  });

  return (
    <Wrapper>
      <DataGrid
        autoHeight
        rows={activeCustomerUsers?.length ? rows : []}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        classes={styles}
      />
    </Wrapper>
  );
};
