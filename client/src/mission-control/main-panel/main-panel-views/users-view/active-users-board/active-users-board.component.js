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

import { UsersViewTableCell } from '../users-view-table-cell.component';

import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
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
      <UsersViewTableCell align="left">User</UsersViewTableCell>
      <UsersViewTableCell align="left">Activated Licences</UsersViewTableCell>
      <UsersViewTableCell align="left">Email</UsersViewTableCell>
      <UsersViewTableCell align="left">Type</UsersViewTableCell>
      <UsersViewTableCell align="left" />
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
      <UsersViewTableCell>{customerUser?.user?.name}</UsersViewTableCell>
      <UsersViewTableCell>{getLicenceInfo(licences)}</UsersViewTableCell>
      <UsersViewTableCell>{customerUser?.user?.email}</UsersViewTableCell>
      <UsersViewTableCell>
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
      </UsersViewTableCell>
      <UsersViewTableCell>
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
      </UsersViewTableCell>
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
 *   activeCustomerUsers: import('typings/orbis').CustomerUser[]
 *   currentUser: import('typings/orbis').User
 *   customer?: import('typings/orbis').Customer
 *   oneAdminRemaining?: boolean
 *   quickViewData?: import('./quick-view/quick-view.component').QuickViewData
 *   onChangeRoleClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 *   onCreateUserClick?: (type: string) => void
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
  onCreateUserClick,
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

  const styles = useStyles();

  return (
    <Box
      className={styles.box}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      <QuickView data={quickViewData} onCreateUserClick={onCreateUserClick} />
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
                <UsersViewTableCell align="center" colSpan={5}>
                  No Active Users
                </UsersViewTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
