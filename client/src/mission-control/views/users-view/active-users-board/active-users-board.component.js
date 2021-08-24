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
import { usePagination } from 'react-table/dist/react-table.development';

import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
import { MissionControlTableCell } from 'mission-control/shared-components/mission-control-table/mission-control-table.component';
import { TablePaginationFooter } from 'mission-control/shared-components/mission-control-table/table.pagination-footer.component';

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
    ],
  );
  const data = useMemo(() => activeCustomerUsers ?? [], [activeCustomerUsers]);
  const {
    headers,
    prepareRow,
    getTableProps,
    getTableBodyProps,
    page,
    pageCount,
    setPageSize,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data, initialState: { pageSize: 5 } }, usePagination);

  return (
    <>
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
          {page.length ? (
            page.map(row => {
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
              <MissionControlTableCell colspan={columns.length} align="center">
                No Active Users
              </MissionControlTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePaginationFooter
        currentPage={pageIndex + 1}
        rowsPerPage={pageSize}
        pageCount={pageCount}
        handleChangeRowsPerPage={setPageSize}
        handleChangePage={(_, page) => gotoPage(page - 1)}
      />
    </>
  );
};
