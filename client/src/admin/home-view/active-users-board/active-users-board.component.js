import React, { useState } from 'react';

import {
  Box,
  Button,
  OptionsIcon,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import OptionsDropdown from '../options-dropdown/options-dropdown.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { ADMIN_STATUS } from '../../admin.constants';

import QuickView from '../active-users-board/quick-view/quick-view.component';

import styles from './active-users-board.module.css';
import tableStyles from '../../table.module.css';
import { AdminTableCell } from 'admin/admin-table/admin-table-cell.component';

const CHANGE_ROLE = 'Change Role';
const OPTIONS = 'Options';
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

const UserRow = ({
  user,
  licences,
  setDropdown,
  changeRoleSelected,
  oneAdminRemaining,
  handleClick,
  onChangeRoleClick,
  optionsSelected,
  currentUser,
  onEditUserClick,
  onDeleteUserClick,
}) => (
  <TableRow>
    <AdminTableCell>{user.user.name}</AdminTableCell>
    <AdminTableCell>{getLicenceInfo(licences)}</AdminTableCell>
    <AdminTableCell>{user.user.email}</AdminTableCell>
    <AdminTableCell>
      <Button
        color="secondary"
        className={styles.optionsRoleButton}
        onClick={() =>
          setDropdown(changeRoleSelected ? null : { type: CHANGE_ROLE, user })
        }
        disabled={user.type === ADMIN_STATUS.manager && oneAdminRemaining}
        endIcon={
          <span
            className={`${styles.arrow} ${
              changeRoleSelected && styles.selected
            }`}
          ></span>
        }
      >
        {user.type === ADMIN_STATUS.manager
          ? USER_LABELS.admin
          : USER_LABELS.standard}
      </Button>

      {changeRoleSelected && (
        <OptionsDropdown
          className={styles.roleDropdown}
          onClickAway={() => setDropdown(null)}
        >
          <button
            className={tableStyles.optionsButton}
            onClick={() => handleClick(onChangeRoleClick, user)}
          >
            {user.type === ADMIN_STATUS.manager
              ? USER_LABELS.standard
              : USER_LABELS.admin}
          </button>
        </OptionsDropdown>
      )}
    </AdminTableCell>
    <AdminTableCell>
      <OptionsIcon
        data-testid="options-icon"
        classes={`${tableStyles.optionsIcon} ${
          optionsSelected && tableStyles.optionsIconSelected
        }`}
        onClick={() =>
          setDropdown(optionsSelected ? null : { type: OPTIONS, user })
        }
      />
      {optionsSelected && (
        <OptionsDropdown
          className={styles.editDropdown}
          onClickAway={() => setDropdown(null)}
        >
          <button
            className={tableStyles.optionsButton}
            onClick={() => handleClick(onEditUserClick, user)}
          >
            Edit
          </button>
          {user.user.id !== currentUser.id && (
            <button
              className={tableStyles.optionsButton}
              onClick={() => handleClick(onDeleteUserClick, user)}
            >
              Delete User
            </button>
          )}
        </OptionsDropdown>
      )}
    </AdminTableCell>
  </TableRow>
);

export const ActiveUsersBoard = ({
  currentUser,
  activeUsers,
  oneAdminRemaining,
  customer,
  quickViewData,
  onChangeRoleClick,
  onEditUserClick,
  onDeleteUserClick,
}) => {
  const [dropdown, setDropdown] = useState(null);

  const handleClick = (fn, user) => {
    fn(user);
    setDropdown(null);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <QuickView data={quickViewData} />
      <Table>
        <TableHeader />
        <TableBody>
          {activeUsers && activeUsers.length > 0 ? (
            activeUsers.map(user => {
              const optionsSelected =
                dropdown?.type === OPTIONS && dropdown.user === user;

              const changeRoleSelected =
                dropdown?.type === CHANGE_ROLE && dropdown.user === user;

              let licences = null;
              if (customer && customer.licences) {
                licences = getUserLicences(user, customer);
              }
              return (
                <UserRow
                  key={user.id}
                  user={user}
                  changeRoleSelected={changeRoleSelected}
                  currentUser={currentUser}
                  handleClick={handleClick}
                  licences={licences}
                  onChangeRoleClick={onChangeRoleClick}
                  onDeleteUserClick={onDeleteUserClick}
                  onEditUserClick={onEditUserClick}
                  oneAdminRemaining={oneAdminRemaining}
                  optionsSelected={optionsSelected}
                  setDropdown={setDropdown}
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
