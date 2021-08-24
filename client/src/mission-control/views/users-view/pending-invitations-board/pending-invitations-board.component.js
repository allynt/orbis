import React, { useMemo, useState } from 'react';

import {
  Button,
  makeStyles,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import {
  usePagination,
  useTable,
} from 'react-table/dist/react-table.development';

import { MissionControlTableCell } from 'mission-control/shared-components/mission-control-table/mission-control-table.component';
import { TablePaginationFooter } from 'mission-control/shared-components/mission-control-table/table.pagination-footer.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const useTableStyles = makeStyles(theme => ({
  resendButton: {
    padding: theme.spacing(1, 2),
  },
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
}));

/**
 * @param {{
 *   pendingUsers?: import('typings').CustomerUser[]
 *   customer?: import('typings').Customer
 *   onResendInvitationClick?: (customerUser: import('typings').CustomerUser) => void
 *   onWithdrawInvitationClick?: (customerUser: import('typings').CustomerUser) => void
 * }} props
 */
export const PendingInvitationsBoard = ({
  pendingUsers,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const styles = useTableStyles();
  const columns = useMemo(
    () => [
      {
        Header: 'Pending Invitations',
        accessor: 'user.name',
      },
      {
        Header: 'Email',
        accessor: 'user.email',
      },
      {
        Header: 'Licence Type',
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
        Header: 'Invitation Sent',
        accessor: 'invitation_date',
        Cell: ({ value }) => format(new Date(value), DATE_FORMAT),
      },
      {
        Header: 'Invited',
        id: 'resend',
        accessor: v => v,
        Cell: ({ value: customerUser }) => (
          <Button
            className={styles.resendButton}
            size="small"
            onClick={() => onResendInvitationClick(customerUser)}
          >
            Resend Invitation
          </Button>
        ),
      },
      {
        id: 'options',
        accessor: v => v,
        Cell: ({ value: customerUser }) => (
          <OptionsMenu>
            <MenuItem
              onClick={() => {
                onWithdrawInvitationClick(customerUser);
              }}
            >
              Withdraw
            </MenuItem>
          </OptionsMenu>
        ),
      },
    ],
    [
      customer,
      onResendInvitationClick,
      onWithdrawInvitationClick,
      styles.resendButton,
    ],
  );
  const data = useMemo(() => pendingUsers ?? [], [pendingUsers]);

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
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    usePagination,
  );

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
                No Pending Users
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
