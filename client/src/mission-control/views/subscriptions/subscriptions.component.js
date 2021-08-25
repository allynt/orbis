import React, { useMemo } from 'react';

import {
  makeStyles,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';
// @ts-ignore
import { usePagination, useTable } from 'react-table';

import { selectLicenceInformation } from 'mission-control/mission-control.slice';
import {
  MissionControlTableCell,
  TablePaginationFooter,
} from 'mission-control/shared-components/mission-control-table';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
}));

/**
 *
 * @param {{
 *  licenceInformation: {
 *    [key: string]: {
 *      purchased: number,
 *      active: number,
 *      available: number,
 *      pending: number
 *    }
 *  }
 * }} props
 */
export const Subscriptions = ({ licenceInformation }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Orb',
        accessor: 'orb',
      },
      { Header: 'Purchased Licences', accessor: 'purchased' },
      { Header: 'Assigned to Users', accessor: 'active' },
      { Header: 'Available to Assign', accessor: 'pending' },
    ],
    [],
  );
  const data = useMemo(
    () =>
      licenceInformation && Object.keys(licenceInformation).length > 0
        ? Object.entries(licenceInformation).map(([orb, values]) => ({
            orb,
            ...values,
          }))
        : [],
    [licenceInformation],
  );

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
      data,
      columns,
      initialState: { pageSize: 5 },
    },
    usePagination,
  );

  const styles = useStyles();
  return (
    <Wrapper title="Subscriptions">
      <Table {...getTableProps({ className: styles.table })}>
        <TableHead>
          <TableRow>
            {headers.map(column => (
              // eslint-disable-next-line react/jsx-key
              <MissionControlTableCell
                {...column.getHeaderProps({
                  align: column.id !== 'orb' ? 'right' : 'left',
                })}
              >
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
                        align: cell.column.id !== 'orb' ? 'right' : 'left',
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
              <MissionControlTableCell colSpan={4} align="center">
                No Subscriptions Available
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
    </Wrapper>
  );
};

export default () => {
  const licenceInformation = useSelector(selectLicenceInformation);
  return <Subscriptions licenceInformation={licenceInformation} />;
};
