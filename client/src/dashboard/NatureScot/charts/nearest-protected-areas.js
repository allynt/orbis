import React, { useMemo } from 'react';

import { makeStyles, Skeleton } from '@astrosat/astrosat-ui';

import { useSortBy } from 'react-table';

import { Table } from 'components/table/table.component';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from '../../charts/chart-wrapper.component';

const skeletonStyles = makeStyles(theme => ({
  areas: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px solid #333f48',
    marginTop: '2rem',
  },
}));

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
              { id: 'distance', desc: false },
              { id: 'name', desc: false },
              { id: 'type', desc: false },
            ],
          },
          disableSortRemove: true,
          autoResetPage: false,
        }}
      ></Table>
    </ChartWrapper>
  );
};

export const NearestProtectedAreasSkeleton = () => {
  const styles = skeletonStyles();
  return (
    <ChartWrapperSkeleton>
      <div className={styles.areas}>
        <Skeleton variant="rect" width={'100%'} height={40}>
          <Skeleton variant="text" width={300} />
        </Skeleton>
        <Skeleton variant="rect" width={'100%'} height={40} />
        <Skeleton variant="rect" width={'100%'} height={40} />
        <Skeleton variant="rect" width={'100%'} height={40} />
        <Skeleton variant="rect" width={'100%'} height={40} />
      </div>
    </ChartWrapperSkeleton>
  );
};

export { NearestProtectedAreas };
