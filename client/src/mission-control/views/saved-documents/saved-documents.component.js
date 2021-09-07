import React, { useMemo } from 'react';

import { IconButton, SvgIcon } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
// @ts-ignore
import { useSortBy } from 'react-table';

import { Table } from 'mission-control/shared-components/mission-control-table';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

// @ts-ignore
import { ReactComponent as PdfIcon } from '../support/pdf.svg';

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
  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'name',
      },
      {
        Header: 'Date',
        accessor: 'timestamp',
        Cell: ({ value }) => format(new Date(value), 'dd-MM-yyyy'),
      },
      {
        accessor: 'file',
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

  return (
    <Wrapper title="Saved Documents">
      <Table
        columns={columns}
        data={data}
        noDataMessage="No Saved Documents"
        getCellProps={cell => ({
          padding: cell.column.id === 'url' ? 'checkbox' : null,
        })}
        pluginHooks={[useSortBy]}
        tableOptions={{
          initialState: { sortBy: [{ id: 'date', desc: true }] },
          disableSortRemove: true,
          autoResetPage: false,
        }}
      />
    </Wrapper>
  );
};

export default SavedDocuments;
