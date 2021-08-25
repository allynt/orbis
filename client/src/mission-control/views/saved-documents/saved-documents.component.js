import React, { useMemo } from 'react';

import {
  IconButton,
  makeStyles,
  SvgIcon,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@astrosat/astrosat-ui';

import { ArrowDropDown } from '@material-ui/icons';
import { format } from 'date-fns';
// @ts-ignore
import { usePagination, useSortBy, useTable } from 'react-table';

import {
  MissionControlTableCell,
  TablePaginationFooter,
} from 'mission-control/shared-components/mission-control-table';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { ReactComponent as PdfIcon } from '../support/pdf.svg';

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
}));

const SortableHeader = ({ children, column }) => (
  <TableSortLabel
    {...column.getSortByToggleProps({
      IconComponent: ArrowDropDown,
      active: column.isSorted,
      direction: column.isSortedDesc ? 'desc' : 'asc',
    })}
  >
    {children}
  </TableSortLabel>
);

/**
 *
 * @param {{
 *  documents: {
 *    id: string,
 *    title: string,
 *    date: string,
 *    url: string
 *  }[]
 * }} props
 */
const SavedDocuments = ({ documents }) => {
  const styles = useStyles({});

  const columns = useMemo(
    () => [
      {
        Header: props => <SortableHeader {...props}>Title</SortableHeader>,
        accessor: 'title',
      },
      {
        Header: props => <SortableHeader {...props}>Date</SortableHeader>,
        accessor: 'date',
        Cell: ({ value }) => format(new Date(value), 'dd-MM-yyyy'),
      },
      {
        accessor: 'url',
        disableSortBy: true,
        Cell: ({ value }) => (
          <IconButton
            component="a"
            href={value}
            target="_blank"
            rel="noreferrer noopener"
          >
            <SvgIcon>
              <PdfIcon />
            </SvgIcon>
          </IconButton>
        ),
      },
    ],
    [],
  );

  const data = useMemo(() => documents, [documents]);

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    prepareRow,
    page,
    pageCount,
    setPageSize,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      initialState: { pageSize: 5, sortBy: [{ id: 'date', desc: true }] },
      disableSortRemove: true,
      autoResetPage: false,
      data,
      columns,
    },
    useSortBy,
    usePagination,
  );

  return (
    <Wrapper title="Saved Documents">
      <Table className={styles.table} {...getTableProps()}>
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
          {page.map(row => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => (
                  // eslint-disable-next-line react/jsx-key
                  <MissionControlTableCell
                    {...cell.getCellProps({
                      // @ts-ignore
                      padding: cell.column.id === 'url' ? 'checkbox' : null,
                    })}
                  >
                    {cell.render('Cell')}
                  </MissionControlTableCell>
                ))}
              </TableRow>
            );
          })}
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

export default SavedDocuments;
