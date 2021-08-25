import React from 'react';

import {
  makeStyles,
  Table as AuiTable,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@astrosat/astrosat-ui';

import { ArrowDropDown } from '@material-ui/icons';
// @ts-ignore
import { usePagination, useTable } from 'react-table';

import { MissionControlTableCell } from './table-cell.component';
import { TablePaginationFooter } from './table.pagination-footer.component';

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
}));

const defaultAccessor = () => ({});

/**
 * @param {{
 *  columns: any[]
 *  data: any[]
 *  noDataMessage?: string
 *  getHeaderProps?: (column: any) => any
 *  getCellProps?: (cell: any) => any
 *  pluginHooks?: any[]
 *  tableOptions?: any
 * }} props
 * @returns
 */
export const Table = ({
  columns,
  data,
  noDataMessage = 'No Data',
  getHeaderProps = defaultAccessor,
  getCellProps = defaultAccessor,
  pluginHooks = [],
  tableOptions = {},
}) => {
  const styles = useStyles();
  const { initialState, ...otherOptions } = tableOptions;
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
      initialState: { pageSize: 5, ...initialState },
      ...otherOptions,
    },
    ...pluginHooks,
    usePagination,
  );
  return (
    <>
      <AuiTable {...getTableProps({ className: styles.table })}>
        <TableHead>
          <TableRow>
            {headers.map(column => (
              // eslint-disable-next-line react/jsx-key
              <MissionControlTableCell
                {...column.getHeaderProps([{}, getHeaderProps(column)])}
              >
                {column.canSort ? (
                  <TableSortLabel
                    {...column.getSortByToggleProps({
                      IconComponent: ArrowDropDown,
                      active: column.isSorted,
                      direction: column.isSortedDesc ? 'desc' : 'asc',
                    })}
                  >
                    {column.render('Header')}
                  </TableSortLabel>
                ) : (
                  column.render('Header')
                )}
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
      {data.length > 4 && (
        <TablePaginationFooter
          currentPage={pageIndex + 1}
          rowsPerPage={pageSize}
          pageCount={pageCount}
          handleChangeRowsPerPage={setPageSize}
          handleChangePage={(_, page) => gotoPage(page - 1)}
        />
      )}
    </>
  );
};
