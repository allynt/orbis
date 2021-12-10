import React, { useMemo } from 'react';

// import { Button } from '@astrosat/astrosat-ui';

import { useSortBy } from 'react-table';

import { Table } from 'components/table/table.component';

import { ChartWrapper } from '../charts/chart-wrapper.component';

export default { title: 'Dashboard/NatureScot/NearestProtectedAreas' };

const NearestProtectedAreas = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        id: 'name',
      },
      {
        Header: 'Type',
        accessor: 'type',
        id: 'type',
      },
      {
        Header: 'Distance',
        accessor: 'distance',
        id: 'distance',
        Cell: ({ value }) => `${value} km`,
      },
      // {
      //   Header: '',
      //   accessor: 'null',
      //   id: 'button',
      //   Cell: ({ value }) => (
      //     <Button
      //       size="small"
      //       href={value}
      //       target="_blank"
      //       rel="noreferrer noopener"
      //     >
      //       More Details
      //     </Button>
      //   ),
      // },
    ],
    [],
  );
  return (
    <ChartWrapper
      title="Nearest Protected Areas"
      info="These are the nearest protected areas to the AOI, in increasing order of distance"
    >
      <Table
        data={data}
        columns={columns}
        noDataMessage="No Data"
        pluginHooks={[useSortBy]}
        getCellProps={cell => ({
          width: cell.column.id === 'button' ? '10%' : '30%',
        })}
        tableOptions={{
          initialState: {
            sortBy: [
              { id: 'name', desc: false },
              { id: 'type', desc: false },
              { id: 'distance', desc: false },
            ],
          },
          disableSortRemove: true,
          autoResetPage: false,
        }}
      ></Table>
    </ChartWrapper>
  );
};

export { NearestProtectedAreas };
