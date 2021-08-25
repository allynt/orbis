import React from 'react';

import {
  Table as AuiTable,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

// @ts-ignore
import { usePagination, useTable } from 'react-table';

import { MissionControlTableCell } from './table-cell.component';
import { TablePaginationFooter } from './table.pagination-footer.component';

const defaultAccessor = () => ({});

/**
 * @param {{
 *  columns: any[],
 *  data: any[],
 *  noDataMessage?: string
 *  getHeaderProps?: (column: any) => any
 *  getCellProps?: (cell: any) => any
 * }} props
 * @returns
 */
export const Table = ({
  columns,
  data,
  noDataMessage = 'No Data',
  getHeaderProps = defaultAccessor,
  getCellProps = defaultAccessor,
}) => {
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
  return (
    <>
      <AuiTable {...getTableProps()}>
        <TableHead>
          <TableRow>
            {headers.map(column => (
              // eslint-disable-next-line react/jsx-key
              <MissionControlTableCell
                {...column.getHeaderProps([{}, getHeaderProps(column)])}
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
                      {...cell.getCellProps([{}, getCellProps(cell)])}
                    >
                      {cell.render('Cell')}
                    </MissionControlTableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <MissionControlTableCell colSpan={columns.length} align="center">
                {noDataMessage}
              </MissionControlTableCell>
            </TableRow>
          )}
        </TableBody>
      </AuiTable>
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
