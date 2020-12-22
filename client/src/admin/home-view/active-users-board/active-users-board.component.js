import React, { useState } from 'react';

import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  OptionsIcon,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TriangleIcon,
} from '@astrosat/astrosat-ui';

import { AdminTableCell } from 'admin/admin-table/admin-table-cell.component';
import { ADMIN_STATUS } from '../../admin.constants';
import { getLicenceInfo, getUserLicences } from '../../licence-utils';
import QuickView from './quick-view/quick-view.component';

const USER_LABELS = {
  standard: 'Standard',
  admin: 'Admin',
};

const TableHeader = () => (
  <TableHead>
    <TableRow>
      <AdminTableCell align="left">User</AdminTableCell>
      <AdminTableCell align="left">Activated Licences</AdminTableCell>
      <AdminTableCell align="left">Email</AdminTableCell>
      <AdminTableCell align="left">Type</AdminTableCell>
      <AdminTableCell align="left" />
    </TableRow>
  </TableHead>
);

/**
 * @param {{
 *   currentUser: import('typings/orbis').User
 *   customerUser: import('typings/orbis').CustomerUser
 *   licences: import('typings/orbis').Licence[]
 *   oneAdminRemaining?: boolean
 *   onDeleteUserClick: () => void
 *   onEditUserClick: () => void
 *   onRoleClick: () => void
 * }} props
 */
const UserRow = ({
  currentUser,
  customerUser,
  licences,
  oneAdminRemaining,
  onDeleteUserClick,
  onEditUserClick,
  onRoleClick,
}) => {
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);

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

  return (
    <TableRow>
      <AdminTableCell>{customerUser.user.name}</AdminTableCell>
      <AdminTableCell>{getLicenceInfo(licences)}</AdminTableCell>
      <AdminTableCell>{customerUser.user.email}</AdminTableCell>
      <AdminTableCell>
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
            vertical: 'bottom',
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
      </AdminTableCell>
      <AdminTableCell>
        <IconButton
          aria-label="Options"
          aria-controls="options-menu"
          color={!!optionsAnchorEl ? 'primary' : 'default'}
          onClick={handleOptionsButtonClick}
        >
          <OptionsIcon
            style={{ transform: 'rotate(90deg)' }}
            data-testid="options-icon"
          />
        </IconButton>
        <Menu
          id="options-menu"
          anchorEl={optionsAnchorEl}
          open={!!optionsAnchorEl}
          onClose={handleOptionsMenuClose}
        >
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          {customerUser?.user?.id !== currentUser?.id && (
            <MenuItem onClick={handleDeleteClick}>Delete User</MenuItem>
          )}
        </Menu>
      </AdminTableCell>
    </TableRow>
  );
};

/**
 * @param {{
 *   activeCustomerUsers: import('typings/orbis').CustomerUser[]
 *   currentUser: import('typings/orbis').User
 *   customer?: import('typings/orbis').Customer
 *   oneAdminRemaining?: boolean
 *   quickViewData?: import('./quick-view/quick-view.component').QuickViewData
 *   onChangeRoleClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 *   onEditUserClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 *   onDeleteUserClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 * }} props
 */
export const ActiveUsersBoard = ({
  activeCustomerUsers,
  currentUser,
  customer,
  oneAdminRemaining,
  quickViewData,
  onChangeRoleClick,
  onEditUserClick,
  onDeleteUserClick,
}) => {
  /**
   * @param {import('typings/orbis').CustomerUser} customerUser
   */
  const handleRoleClick = customerUser => {
    onChangeRoleClick(customerUser);
  };

  /**
   * @param {import('typings/orbis').CustomerUser} customerUser
   */
  const handleEditClick = customerUser => {
    onEditUserClick(customerUser);
  };

  /**
   * @param {import('typings/orbis').CustomerUser} customerUser
   */
  const handleDeleteClick = customerUser => {
    onDeleteUserClick(customerUser);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <QuickView data={quickViewData} />
      <Table>
        <TableHeader />
        <TableBody>
          {activeCustomerUsers?.length > 0 ? (
            activeCustomerUsers.map(customerUser => {
              let licences = null;
              if (customer && customer.licences) {
                licences = getUserLicences(customerUser, customer);
              }
              return (
                <UserRow
                  key={customerUser.id}
                  customerUser={customerUser}
                  currentUser={currentUser}
                  licences={licences}
                  oneAdminRemaining={oneAdminRemaining}
                  onDeleteUserClick={() => handleDeleteClick(customerUser)}
                  onEditUserClick={() => handleEditClick(customerUser)}
                  onRoleClick={() => handleRoleClick(customerUser)}
                />
              );
            })
          ) : (
            <TableRow>
              <AdminTableCell align="center" colSpan={5}>
                No Active Users
              </AdminTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
