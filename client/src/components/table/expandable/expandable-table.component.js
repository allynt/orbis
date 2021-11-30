import React from 'react';

import {
  makeStyles,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@astrosat/astrosat-ui';

import { ArrowDropDown } from '@material-ui/icons';
import { useTable, useExpanded, usePagination } from 'react-table';

import { TablePaginationFooter } from '../table.pagination-footer.component';

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
  tableCell: {
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
  console.log('DATA: ', data);

  return (
    <>
      <MuiTable {...getTableProps({ className: styles.table })}>
        <TableHead>
          {headerGroups.map(headerGroup => {
            return (
              // eslint-disable-next-line react/jsx-key
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  // eslint-disable-next-line react/jsx-key
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <TableCell
                      {...column.getHeaderProps()}
                      className={styles.tableCell}
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
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHead>

        <TableBody {...getTableBodyProps()}>
          {page.length ? (
            page.map(row => {
              console.log('FIRST Row log: ', row);
              prepareRow(row);
              console.log('Another Row log: ', row);

              return (
                // eslint-disable-next-line react/jsx-key
                <React.Fragment {...row.getRowProps()}>
                  <TableRow>
                    {row.cells.map(cell => {
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <TableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                  {row.isExpanded ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length}>
                        {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                        {console.log('Yet another ROW DATA: ', row)}
                        {renderRowSubComponent({ row })}
                        {/* {() => {
                          console.log('PASSING DATA ROW: ', row);
                          return renderRowSubComponent({ row });
                        }} */}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {noDataMessage}
              </TableCell>
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
