import React, { useState } from 'react';

import {
  Box,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  TableBody,
  TableContainer,
  TableHead,
  TriangleIcon,
} from '@astrosat/astrosat-ui';

import { TablePaginationFooter } from '../../shared-components/table.pagination-footer.component';

import {
  UsersViewTable,
  UsersViewTableRow,
  UsersViewTableCell,
} from 'mission-control/mission-control-table/mission-control-table.component';

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
    <UsersViewTableRow>
      <UsersViewTableCell align="left">Users</UsersViewTableCell>
      <UsersViewTableCell align="left">Activated Licences</UsersViewTableCell>
      <UsersViewTableCell align="left">Email</UsersViewTableCell>
      <UsersViewTableCell align="left">Type</UsersViewTableCell>
      <UsersViewTableCell align="left" />
    </UsersViewTableRow>
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
    <UsersViewTableRow>
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
    </UsersViewTableRow>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    height: `calc(100% - ${theme.spacing(10)})`,
    padding: `0 ${theme.spacing(6.5)}`,
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
 *   onCreateUserClick?: (customerUser: import('typings/orbis').CustomerUser) => void
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
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleChangePage = (_, newPage) => {
    setCurrentPage(newPage - 1);
  };

  const handleChangeRowsPerPage = value => {
    setRowsPerPage(parseInt(value, 10));
    setCurrentPage(0);
  };

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const styles = useStyles({});

  const rows =
    activeCustomerUsers?.length > 0 ? (
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
      <UsersViewTableRow>
        <UsersViewTableCell align="center" colSpan={5}>
          No Active Users
        </UsersViewTableCell>
      </UsersViewTableRow>
    );

  const pageCount = Math.ceil(rows?.length / rowsPerPage);

  return (
    <Box
      className={styles.container}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      <QuickView data={quickViewData} onCreateUserClick={onCreateUserClick} />
      <TableContainer>
        <UsersViewTable>
          <TableHeader />
          <TableBody>
            {Array.isArray(rows) && rowsPerPage > 0
              ? rows?.slice(
                  currentPage * rowsPerPage,
                  currentPage * rowsPerPage + rowsPerPage,
                )
              : rows}
          </TableBody>
        </UsersViewTable>
        {Array.isArray(rows) && rows.length > rowsPerPage ? (
          <TablePaginationFooter
            currentPage={currentPage + 1}
            rowsPerPage={rowsPerPage}
            pageCount={pageCount}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleChangePage={handleChangePage}
            handlePrevClick={handlePrevClick}
            handleNextClick={handleNextClick}
          />
        ) : null}
      </TableContainer>
    </Box>
  );
};
