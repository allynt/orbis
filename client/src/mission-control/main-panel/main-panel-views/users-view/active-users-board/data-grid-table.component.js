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

const Wrapper = styled('div')(({ theme }) => ({
  height: theme.spacing(50),
  width: '100%',
}));

const useStyles = makeStyles(theme => ({
  root: {
    border: '2px solid red',
  },
}));

const USER_LABELS = {
  standard: 'Standard',
  admin: 'Admin',
};

export const DataGridTable = ({
  customer,
  activeCustomerUsers,
  currentUser,
  oneAdminRemaining,
  handleDeleteClick,
  handleEditClick,
  handleRoleClick,
}) => {
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);

  // Contains handler logic attached to the admin status button
  const getUserRowData = ({
    customerUser,
    licences,
    onDeleteUserClick,
    onEditUserClick,
    onRoleClick,
  }) => {
    /**
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
     */
    const handleRoleButtonClick = e => {
      setRoleAnchorEl(e.currentTarget);
    };

    const handleRoleClick = () => {
      onRoleClick();
      setRoleAnchorEl(null);
    };

    const handleRoleMenuClose = () => {
      setRoleAnchorEl(null);
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

    const handleEditClick = () => {
      onEditUserClick();
      setOptionsAnchorEl(null);
    };

    const handleDeleteClick = () => {
      onDeleteUserClick();
      setOptionsAnchorEl(null);
    };

    return {
      id: customerUser?.id,
      user: customerUser?.user?.name,
      activatedLicences: getLicenceInfo(licences),
      type: customerUser?.type,
      email: customerUser?.user?.email,
      handlers: {
        handleRoleButtonClick,
        handleRoleClick,
        handleRoleMenuClose,
        handleOptionsButtonClick,
        handleOptionsMenuClose,
        handleEditClick,
        handleDeleteClick,
      },
    };
  };

  // Contains handler logic attached to the edit icon
  const AdminStatusActions = ({ customerUser, handlers }) => {
    const {
      handleRoleButtonClick,
      handleRoleClick,
      handleRoleMenuClose,
    } = handlers;
    return (
      <>
        <Button
          aria-controls="role-menu"
          color="secondary"
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
          <MenuItem onClick={handleRoleClick}>
            {customerUser.type === ADMIN_STATUS.manager
              ? USER_LABELS.standard
              : USER_LABELS.admin}
          </MenuItem>
        </Menu>
      </>
    );
  };

  const EditButtonActions = ({ customerUser, handlers }) => {
    const {
      handleOptionsButtonClick,
      handleOptionsMenuClose,
      handleEditClick,
      handleDeleteClick,
    } = handlers;
    return (
      <OptionsMenu
        anchorEl={optionsAnchorEl}
        onButtonClick={handleOptionsButtonClick}
        onClose={handleOptionsMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        {customerUser?.user?.id !== currentUser?.id && (
          <MenuItem onClick={handleDeleteClick}>Delete User</MenuItem>
        )}
      </OptionsMenu>
    );
  };

  // Determines columns to show in table
  const columns = [
    { field: 'user', headerName: 'User' },
    {
      field: 'activatedLicences',
      headerName: 'Activated Licences',
    },
    { field: 'email', headerName: 'Email' },
    { field: 'type', headerName: 'Type' },
    {
      field: 'adminStatusActions',
      headerName: 'Update admin status',
      renderCell: ({ row }) => {
        return (
          <AdminStatusActions
            customerUser={activeCustomerUsers?.find(u => u.id === row.id)}
            handlers={row.handlers}
          />
        );
      },
    },
    {
      field: 'editButtonActions',
      headerName: 'Edit user',
      renderCell: ({ row }) => {
        return (
          <EditButtonActions
            customerUser={activeCustomerUsers?.find(u => u.id === row.id)}
            handlers={row.handlers}
          />
        );
      },
    },
  ];

  // Array of data objects to be mapped to columns specified above
  const rows = activeCustomerUsers?.map(customerUser => {
    let licences = null;
    if (customer && customer.licences) {
      licences = getUserLicences(customerUser, customer);
    }

    return getUserRowData({
      customerUser,
      licences,
      onDeleteUserClick: () => handleDeleteClick(customerUser),
      onEditUserClick: () => handleEditClick(customerUser),
      onRoleClick: () => handleRoleClick(customerUser),
    });
  });

  const styles = useStyles({});
  return (
    <Wrapper>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        classes={styles}
      />
    </Wrapper>
  );
};
