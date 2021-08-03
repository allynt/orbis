import React, { useState } from 'react';

import {
  Box,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TriangleIcon,
} from '@astrosat/astrosat-ui';

import { AdminTableCell } from 'admin/admin-table/admin-table-cell.component';

import { ADMIN_STATUS } from '../../admin.constants';
import { getLicenceInfo, getUserLicences } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';
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
 *   currentUser: import('typings').User
 *   customerUser: import('typings').CustomerUser
 *   licences: import('typings').Licence[]
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
      <AdminTableCell>{customerUser?.user?.name}</AdminTableCell>
      <AdminTableCell>{getLicenceInfo(licences)}</AdminTableCell>
      <AdminTableCell>{customerUser?.user?.email}</AdminTableCell>
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
      </AdminTableCell>
      <AdminTableCell>
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
      </AdminTableCell>
    </TableRow>
  );
};

const useStyles = makeStyles(theme => ({
  box: {
    maxHeight: `calc(100% - ${theme.spacing(10)})`,
  },
}));

/**
 * @param {{
 *   activeCustomerUsers: import('typings').CustomerUser[]
 *   currentUser: import('typings').User
 *   customer?: import('typings').Customer
 *   oneAdminRemaining?: boolean
 *   quickViewData?: import('./quick-view/quick-view.component').QuickViewData
 *   onChangeRoleClick?: (customerUser: import('typings').CustomerUser) => void
 *   onEditUserClick?: (customerUser: import('typings').CustomerUser) => void
 *   onDeleteUserClick?: (customerUser: import('typings').CustomerUser) => void
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
   * @param {import('typings').CustomerUser} customerUser
   */
  const handleRoleClick = customerUser => {
    onChangeRoleClick(customerUser);
  };

  /**
   * @param {import('typings').CustomerUser} customerUser
   */
  const handleEditClick = customerUser => {
    onEditUserClick(customerUser);
  };

  /**
   * @param {import('typings').CustomerUser} customerUser
   */
  const handleDeleteClick = customerUser => {
    onDeleteUserClick(customerUser);
  };

  const styles = useStyles();

  return (
    <Box
      className={styles.box}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      <QuickView data={quickViewData} />
      <TableContainer>
        <Table stickyHeader>
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
                    key={customerUser.user.id}
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
      </TableContainer>
    </Box>
  );
};
