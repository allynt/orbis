import React, { useEffect, useMemo, useState } from 'react';

import { IconButton, SvgIcon } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { NotificationManager } from 'react-notifications';
// @ts-ignore
import { useSortBy } from 'react-table';

import apiClient from 'api-client';
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
export const SavedDocuments = ({ documents }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: row => (row.title ? row.title : row.name),
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

  const data = useMemo(() => (documents ? documents : []), [documents]);

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

export default () => {
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    if (!documents) {
      const fetchDocs = async () => {
        try {
          const docs = await apiClient.documents.getAgreedDocuments();
          setDocuments(docs);
        } catch (error) {
          /** @type {import('api-client').ResponseError} */
          const { message, status } = error;
          NotificationManager.error(
            `${status} ${message}`,
            `Fetching Agreed Documents Error - ${message}`,
            50000,
            () => {},
          );
        }
      };

      fetchDocs();
    }
  }, [documents]);

  return <SavedDocuments documents={documents} />;
};
