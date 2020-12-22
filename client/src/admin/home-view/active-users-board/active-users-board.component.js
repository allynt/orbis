import React, { useRef, useState } from 'react';

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

/**
 * @param {{
 *   user: import('typings/orbis').CustomerUser
 *   licences: import('typings/orbis').Licence[]
 *   setDropdown: React.Dispatch<{type: string, user: import('typings/orbis').CustomerUser}>
 *   changeRoleSelected?: boolean
 *   optionsSelected?: boolean
 *   oneAdminRemaining?: boolean
 *   handleClick: (fn: any, user: any) => void
 *   onEditUserClick: () => void
 *   onDeleteUserClick: () => void
 *   onChangeRoleClick: () => void
 *   currentUser: import('typings/orbis').User
 * }} props
 */
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
}) => {
  const roleButtonRef = useRef();
  const optionsButtonRef = useRef();

  return (
    <TableRow>
      <AdminTableCell>{user.user.name}</AdminTableCell>
      <AdminTableCell>{getLicenceInfo(licences)}</AdminTableCell>
      <AdminTableCell>{user.user.email}</AdminTableCell>
      <AdminTableCell>
        <Button
          aria-controls="role-menu"
          ref={roleButtonRef}
          color="secondary"
          onClick={() => setDropdown({ type: CHANGE_ROLE, user })}
          disabled={user.type === ADMIN_STATUS.manager && oneAdminRemaining}
          size="small"
          endIcon={<TriangleIcon style={{ transform: 'rotate(180deg)' }} />}
        >
          {user.type === ADMIN_STATUS.manager
            ? USER_LABELS.admin
            : USER_LABELS.standard}
        </Button>
        <Menu
          id="role-menu"
          anchorEl={roleButtonRef.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={changeRoleSelected}
          onClose={() => setDropdown(null)}
        >
          <MenuItem onClick={() => handleClick(onChangeRoleClick, user)}>
            {user.type === ADMIN_STATUS.manager
              ? USER_LABELS.standard
              : USER_LABELS.admin}
          </MenuItem>
        </Menu>
      </AdminTableCell>
      <AdminTableCell>
        <IconButton
          aria-label="Options"
          aria-controls="options-menu"
          ref={optionsButtonRef}
          color={optionsSelected ? 'primary' : 'default'}
          onClick={() => setDropdown({ type: OPTIONS, user })}
        >
          <OptionsIcon
            style={{ transform: 'rotate(90deg)' }}
            data-testid="options-icon"
          />
        </IconButton>
        <Menu
          id="options-menu"
          anchorEl={optionsButtonRef.current}
          open={optionsSelected}
          onClose={() => setDropdown(null)}
        >
          <MenuItem onClick={() => handleClick(onEditUserClick, user)}>
            Edit
          </MenuItem>
          {user?.user?.id !== currentUser?.id && (
            <MenuItem onClick={() => handleClick(onDeleteUserClick, user)}>
              Delete User
            </MenuItem>
          )}
        </Menu>
      </AdminTableCell>
    </TableRow>
  );
};

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
