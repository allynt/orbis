import React, { useMemo } from 'react';

import {
  IconButton,
  makeStyles,
  SvgIcon,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { useTable } from 'react-table';

import { MissionControlTableCell } from 'mission-control/shared-components/mission-control-table/mission-control-table.component';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { ReactComponent as PdfIcon } from '../support/pdf.svg';

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
}));

/**
 *
 * @param {{
 *  cell: import('react-table').Cell<{
 *    id: string,
 *    title: string,
 *    date: string,
 *    url: string
 *  }>}} props
 */
const Cell = ({ cell }) => {
  if (cell.column.id === 'date') {
    return format(new Date(cell.value), 'dd-MM-yyyy');
  }

  if (cell.column.id === 'url') {
    return (
      <IconButton
        component="a"
        href={cell.value}
        target="_blank"
        rel="noreferrer noopener"
      >
        <SvgIcon>
          <PdfIcon />
        </SvgIcon>
      </IconButton>
    );
  }
  return cell.render('Cell');
};

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
      { Header: 'Title', accessor: 'title' },
      { Header: 'Date', accessor: 'date' },
      { accessor: 'url' },
    ],
    [],
  );

  const data = useMemo(() => documents, [documents]);

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
  } = useTable({
    data,
    columns,
  });

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
          {rows.map(row => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => (
                  // eslint-disable-next-line react/jsx-key
                  <MissionControlTableCell {...cell.getCellProps()}>
                    {cell.render(Cell)}
                  </MissionControlTableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Wrapper>
  );
};

export default SavedDocuments;
