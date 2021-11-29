import React, { useMemo } from 'react';

import { useSortBy } from 'react-table';

import { Table } from 'mission-control/shared-components/mission-control-table';

import { ChartWrapper } from '../charts/chart-wrapper.component';
import * as data from '../mock-data/NatureScot/mock-nearest-protected-areas';

export default { title: 'Dashboard/NatureScot/NearestProtectedAreas' };

const Template = args => {
  console.log(args.data);
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Distance',
        accessor: 'distance',
        Cell: ({ value }) => `${value}km`,
      },
    ],
    [],
  );
  return (
    <ChartWrapper
      title="Nearest Protected Areas"
      info="These are the nearest protected areas to the AOI, in increasing order of distance"
    >
      <Table
        data={args.data}
        columns={columns}
        noDataMessage="No data passed to component"
        pluginHooks={[useSortBy]}
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

export const Default = Template.bind({});
Default.args = {
  data: data,
};
