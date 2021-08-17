import React, { useState } from 'react';

import {
  Button,
  TableRow,
  makeStyles,
  Menu,
  MenuItem,
  TriangleIcon,
} from '@astrosat/astrosat-ui';

import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
import {
  MissionControlTable,
  MissionControlTableCell,
} from 'mission-control/shared-components/mission-control-table/mission-control-table.component';

import { getLicenceInfo, getUserLicences } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';
import QuickView from './quick-view/quick-view.component';

const USER_LABELS = {
  standard: 'Standard',
  admin: 'Admin',
};

const useStyles = makeStyles(theme => ({
  statusButton: {
    padding: theme.spacing(1, 4),
    minWidth: '10rem',
  },
}));
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
const ActiveUserRow = ({
  currentUser,
  customerUser,
  licences,
  oneAdminRemaining,
  onDeleteUserClick,
  onEditUserClick,
  onRoleClick,
}) => {
  const styles = useStyles({});
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
      <MissionControlTableCell>
        {customerUser?.user?.name}
      </MissionControlTableCell>
      <MissionControlTableCell>
        {getLicenceInfo(licences)}
      </MissionControlTableCell>
      <MissionControlTableCell>
        {customerUser?.user?.email}
      </MissionControlTableCell>
      <MissionControlTableCell>
        <Button
          className={styles.statusButton}
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
      </MissionControlTableCell>
    </TableRow>
  );
};

/**
 * @param {{
 *   activeCustomerUsers: import('typings').CustomerUser[]
 *   currentUser: import('typings').User
 *   customer?: import('typings').Customer
 *   oneAdminRemaining?: boolean
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
  onChangeRoleClick,
  onEditUserClick,
  onDeleteUserClick,
}) => {
  const columnHeaders = ['Users', 'Orb Access', 'Email', 'Type'];

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

  const rows = activeCustomerUsers?.map(customerUser => {
    let licences = null;
    if (customer && customer.licences) {
      licences = getUserLicences(customerUser, customer);
    }
    return (
      <ActiveUserRow
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
  });

  return (
    <MissionControlTable
      rows={rows}
      columnHeaders={columnHeaders}
      noDataMessage="No Active Users"
    />
  );
};
