import React, { useState } from 'react';

import {
  Button,
  TableRow,
  makeStyles,
  Menu,
  MenuItem,
  TriangleIcon,
  Table,
  TableHead,
  TableBody,
} from '@astrosat/astrosat-ui';

import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
import { MissionControlTableCell } from 'mission-control/shared-components/mission-control-table/mission-control-table.component';

import { getLicenceInfo, getUserLicences } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const USER_LABELS = {
  standard: 'Standard',
  admin: 'Admin',
};

const NameCell = ({ name }) => (
  <MissionControlTableCell>{name}</MissionControlTableCell>
);

const EmailCell = ({ email }) => (
  <MissionControlTableCell>{email}</MissionControlTableCell>
);

const LicencesCell = ({ customerUser, customer }) => {
  let licences = null;
  if (customer && customer.licences) {
    licences = getUserLicences(customerUser, customer);
  }
  return (
    <MissionControlTableCell>
      {getLicenceInfo(licences)}
    </MissionControlTableCell>
  );
};

const RoleCell = ({ customerUser, oneAdminRemaining, onRoleClick }) => {
  const styles = useStyles();
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);

  const handleRoleButtonClick = e => {
    setRoleAnchorEl(e.currentTarget);
  };

  const handleRoleMenuClose = () => {
    setRoleAnchorEl(null);
  };

  const handleRoleClick = () => {
    onRoleClick();
    setRoleAnchorEl(null);
  };

  return (
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
        classes={{ list: styles.menu }}
        id="role-menu"
        anchorEl={roleAnchorEl}
        transformOrigin={{
          vertical: -40,
          horizontal: 'left',
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
    </MissionControlTableCell>
  );
};

const OptionsCell = ({
  customerUser,
  onEditUserClick,
  onDeleteUserClick,
  currentUser,
}) => {
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

  const handleEditClick = () => {
    onEditUserClick();
    setOptionsAnchorEl(null);
  };

  const handleDeleteClick = () => {
    onDeleteUserClick();
    setOptionsAnchorEl(null);
  };
  return (
    <MissionControlTableCell padding="checkbox">
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
  );
};

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
  statusButton: {
    padding: theme.spacing(1, 4),
    minWidth: '10rem',
  },
  menu: {
    minWidth: `calc(10rem - ${theme.spacing(2)})`,
    margin: theme.spacing(0, 1),
  },
}));

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
  const styles = useStyles();
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

  return (
    <Table className={styles.table}>
      <TableHead>
        {['Users', 'Email', 'Activated Licences', 'Type'].map(column => (
          <MissionControlTableCell key={column} align="left">
            {column}
          </MissionControlTableCell>
        ))}
      </TableHead>
      <TableBody>
        {activeCustomerUsers?.map(customerUser => (
          <TableRow key={customerUser.id}>
            <NameCell name={customerUser?.user?.name} />
            <EmailCell email={customerUser?.user?.email} />
            <LicencesCell customer={customer} customerUser={customerUser} />
            <RoleCell
              customerUser={customerUser}
              onRoleClick={() => handleRoleClick(customerUser)}
              oneAdminRemaining={oneAdminRemaining}
            />
            <OptionsCell
              customerUser={customerUser}
              currentUser={currentUser}
              onDeleteUserClick={() => handleDeleteClick(customerUser)}
              onEditUserClick={() => handleEditClick(customerUser)}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
