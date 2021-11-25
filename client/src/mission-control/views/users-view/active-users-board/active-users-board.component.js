import React, { useMemo } from 'react';

import {
  Button,
  makeStyles,
  MenuItem,
  TriangleIcon,
} from '@astrosat/astrosat-ui';

import { OptionsMenu } from 'components/options-menu/options-menu.component';
import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
import { Table } from 'mission-control/shared-components/mission-control-table';

import { getLicenceInfo, getUserLicences } from '../../licence-utils';

const USER_LABELS = {
  standard: 'Standard',
  admin: 'Admin',
};

const useStyles = makeStyles(theme => ({
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
  const columns = useMemo(
    () => [
      { Header: 'Users', accessor: 'user.name' },
      { Header: 'Email', accessor: 'user.email' },
      {
        Header: 'Activated Licences',
        id: 'licences',
        accessor: customerUser => {
          let licences = null;
          if (customer && customer.licences) {
            licences = getUserLicences(customerUser, customer);
          }
          return getLicenceInfo(licences);
        },
      },
      {
        Header: 'Type',
        id: 'role',
        accessor: v => v,
        Cell: ({ value: customerUser }) => (
          <OptionsMenu
            classes={{ list: styles.menu }}
            id="role-menu"
            transformOrigin={{
              vertical: -40,
              horizontal: 'left',
            }}
            Button={props => (
              <Button
                className={styles.statusButton}
                aria-controls="role-menu"
                color="secondary"
                disabled={
                  (customerUser.type === ADMIN_STATUS.manager &&
                    oneAdminRemaining) ||
                  currentUser.id === customerUser.user.id
                }
                size="small"
                endIcon={
                  <TriangleIcon style={{ transform: 'rotate(180deg)' }} />
                }
                {...props}
              >
                {customerUser.type === ADMIN_STATUS.manager
                  ? USER_LABELS.admin
                  : USER_LABELS.standard}
              </Button>
            )}
          >
            <MenuItem
              onClick={() => {
                onChangeRoleClick(customerUser);
              }}
            >
              {customerUser.type === ADMIN_STATUS.manager
                ? USER_LABELS.standard
                : USER_LABELS.admin}
            </MenuItem>
          </OptionsMenu>
        ),
      },
      {
        id: 'options',
        accessor: v => v,
        Cell: ({ value: customerUser }) => (
          <OptionsMenu>
            <MenuItem
              onClick={() => {
                onEditUserClick(customerUser);
              }}
            >
              Edit
            </MenuItem>
            {customerUser?.user?.id !== currentUser?.id && (
              <MenuItem
                onClick={() => {
                  onDeleteUserClick(customerUser);
                }}
              >
                Delete User
              </MenuItem>
            )}
          </OptionsMenu>
        ),
      },
    ],
    [
      currentUser,
      customer,
      onChangeRoleClick,
      onDeleteUserClick,
      onEditUserClick,
      oneAdminRemaining,
      styles.menu,
      styles.statusButton,
    ],
  );
  const data = useMemo(() => activeCustomerUsers ?? [], [activeCustomerUsers]);

  return (
    <Table
      columns={columns}
      data={data}
      noDataMessage="No Active Users"
      getCellProps={cell => ({
        padding: cell.column.id === 'options' ? 'checkbox' : 'inherit',
      })}
    />
  );
};
