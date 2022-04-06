import React from 'react';

import {
  makeStyles,
  Table as MuiTable,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@astrosat/astrosat-ui';

import { ArrowDropDown } from '@material-ui/icons';
import { useTable, useExpanded, usePagination } from 'react-table';

import { OrbisTableCell } from 'components/table/table-cell.component';

import { TablePaginationFooter } from '../table.pagination-footer.component';

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
  OrbisTableCell: {
    backgroundColor: theme.palette.background.default,
    '&:first-of-type': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    '&:last-of-type': {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
    border: 'none',
  },
}));

const ExpandableTable = ({
  columns,
  data,
  pluginHooks = [],
  renderRowSubComponent,
  noDataMessage = 'No Data',
}) => {
  const styles = useStyles();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    pageCount,
    setPageSize,
    gotoPage,
    prepareRow,
    visibleColumns,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    ...pluginHooks,
    useExpanded,
    usePagination,
  );

  return (
    <>
      <MuiTable {...getTableProps({ className: styles.table })}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            // eslint-disable-next-line react/jsx-key
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // eslint-disable-next-line react/jsx-key
                <OrbisTableCell
                  {...column.getHeaderProps()}
                  className={styles.OrbisTableCell}
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
                </OrbisTableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody {...getTableBodyProps()}>
          {page.length ? (
            page.map(row => {
              prepareRow(row);

              return (
                // eslint-disable-next-line react/jsx-key
                <React.Fragment key={row.original.name}>
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <OrbisTableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </OrbisTableCell>
                      );
                    })}
                  </TableRow>

                  {row.isExpanded ? (
                    <TableRow>
                      <OrbisTableCell colSpan={visibleColumns.length}>
                        {renderRowSubComponent({ row })}
                      </OrbisTableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <OrbisTableCell colSpan={columns.length} align="center">
                {noDataMessage}
              </OrbisTableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>

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

export default ExpandableTable;
