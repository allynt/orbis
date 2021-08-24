import React, { useMemo, useState } from 'react';

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

// @ts-ignore
import { useTable } from 'react-table';

import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
import { MissionControlTableCell } from 'mission-control/shared-components/mission-control-table/mission-control-table.component';

import { getLicenceInfo, getUserLicences } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const USER_LABELS = {
  standard: 'Standard',
  admin: 'Admin',
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
    <>
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
    </>
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
          <RoleCell
            customerUser={customerUser}
            onRoleClick={() => onChangeRoleClick(customerUser)}
            oneAdminRemaining={oneAdminRemaining}
          />
        ),
      },
      {
        id: 'options',
        accessor: v => v,
        Cell: ({ value: customerUser }) => (
          <OptionsCell
            customerUser={customerUser}
            currentUser={currentUser}
            onDeleteUserClick={() => onDeleteUserClick(customerUser)}
            onEditUserClick={() => onEditUserClick(customerUser)}
          />
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
    ],
  );
  const data = useMemo(() => activeCustomerUsers ?? [], [activeCustomerUsers]);
  const {
    headers,
    rows,
    prepareRow,
    getTableProps,
    getTableBodyProps,
  } = useTable({ columns, data });

  return (
    <Table {...getTableProps({ className: styles.table })}>
      <TableHead>
        <TableRow>
          {headers.map(column => (
            // eslint-disable-next-line react/jsx-key
            <MissionControlTableCell {...column.getHeaderProps()}>
              {column.render('Header')}
            </MissionControlTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.length ? (
          rows.map(row => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => (
                  // eslint-disable-next-line react/jsx-key
                  <MissionControlTableCell
                    {...cell.getCellProps({
                      padding:
                        cell.column.id === 'options' ? 'checkbox' : 'inherit',
                    })}
                  >
                    {cell.render('Cell')}
                  </MissionControlTableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <MissionControlTableCell colspan={columns.length}>
              No Active Users
            </MissionControlTableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
