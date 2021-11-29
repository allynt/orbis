import React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { useSortBy } from 'react-table';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

import ExpandableTable from './expandable-table.component';

const makeData = () => {
  return [
    {
      code: '9540',
      received: '"2003-01-16T00:00:00.000Z"',
      response:
        'C1 - No objection - little or no natural heritage interests affected',
      type: 'SEPA Consultations',
      subRows: undefined,
    },
    {
      code: '11878',
      received: '"2003-06-26T00:00:00.000Z"',
      response:
        'C1 - No objection - little or no natural heritage interests affected',
      type: 'Other Developments',
      subRows: undefined,
    },
    {
      code: '13626',
      received: '"2003-09-12T00:00:00.000Z"',
      response:
        'C4 - No objection but recommend conditions/modifications - natural heritage interests of lesser importance with substantial development impacts',
      type: 'Scottish Forestry Grant Scheme',
      subRows: undefined,
    },
    {
      code: '13629',
      received: '"2003-08-14T00:00:00.000Z"',
      response: 'B. Support',
      type: 'Woodland Grant Scheme',
      subRows: undefined,
    },
    {
      code: '13058',
      received: '"2003-08-14T00:00:00.000Z"',
      response:
        'C1 - No objection - little or no natural heritage interests affected',
      type: 'Housing Developments',
      subRows: undefined,
    },
    {
      code: '11062',
      received: '"2003-05-09T00:00:00.000Z"',
      response: 'Information/Advice only',
      type: 'Housing Developments',
      subRows: undefined,
    },
    {
      code: '15485',
      received: '"2003-12-23T00:00:00.000Z"',
      response: 'Information/Advice only',
      type: 'Site Search',
      subRows: undefined,
    },
  ];
};

const COLUMNS = [
  {
    Header: 'Code',
    accessor: 'code',
  },
  {
    Header: 'Received',
    accessor: 'received',
  },
  {
    // Make an expander cell
    Header: () => null, // No header
    id: 'expander', // It needs an ID
    Cell: ({ row }) => (
      // Use Cell to render an expander for each row.
      // We can use the getToggleRowExpandedProps prop-getter
      // to build the expander.
      <span {...row.getToggleRowExpandedProps()}>
        {row.isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
      </span>
    ),
  },
];

export default {
  title: 'Components/Table/Expandable Table',
};

export const Default = args => {
  const columns = React.useMemo(() => COLUMNS, []);
  const data = React.useMemo(() => makeData(), []);

  const renderRowSubComponent = React.useCallback(({ row }) => {
    console.log('ROW DATA: ', row.original);
    return (
      <Grid container rowSpacing={1} coloumnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={1}>
          <Typography variant="h4">Caseword Title:</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>Type Title Here</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="h4">Site Name:</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>Type Title Here</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="h4">Site Type:</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>Type Title Here</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="h4">Casework Decsion:</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>Type Title Here</Typography>
        </Grid>
      </Grid>
      // <pre
      //   style={{
      //     fontSize: '10px',
      //   }}
      // >
      //   <code>{JSON.stringify({ values: row.original }, null, 2)}</code>
      // </pre>
    );
  }, []);

  return (
    <ExpandableTable
      {...args}
      columns={columns}
      data={data}
      pluginHooks={[useSortBy]}
      renderRowSubComponent={renderRowSubComponent}
    />
  );
};

export const InWrapper = args => {
  const columns = React.useMemo(() => COLUMNS, []);
  const data = React.useMemo(() => makeData(), []);

  const renderRowSubComponent = React.useCallback(({ row }) => {
    return (
      <pre
        style={{
          fontSize: '10px',
        }}
      >
        <code>{JSON.stringify({ values: row.original }, null, 2)}</code>
      </pre>
    );
  }, []);

  return (
    <ChartWrapper
      title="Protected Features"
      info="The description for this panel"
    >
      <ExpandableTable
        {...args}
        columns={columns}
        data={data}
        pluginHooks={[useSortBy]}
        renderRowSubComponent={renderRowSubComponent}
      />
    </ChartWrapper>
  );
};
