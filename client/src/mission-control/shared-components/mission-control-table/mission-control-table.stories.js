import React from 'react';

import { TableRow, TableCell } from '@astrosat/astrosat-ui';

import { MissionControlTable } from './mission-control-table.component';

const TEST_DATA = ['test-1', 'test-2', 'test-3'];

const columnHeaders = TEST_DATA.map(t => `${t}-header`);

const testRows = TEST_DATA.map(row => (
  <TableRow>
    <TableCell>{row}</TableCell>
  </TableRow>
));

export default {
  title: 'Mission Control/Mission Control Table',
};

const Template = args => (
  <MissionControlTable
    columnHeaders={columnHeaders}
    noDataMessage="Test Message"
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {
  rows: testRows,
};

export const NoData = Template.bind({});
NoData.args = {
  rows: null,
};

export const LotsOfData = Template.bind({});
LotsOfData.args = {
  rows: [
    ...testRows,
    ...testRows,
    ...testRows,
    ...testRows,
    ...testRows,
    ...testRows,
  ],
};
