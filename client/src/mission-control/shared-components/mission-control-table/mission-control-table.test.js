import React from 'react';

import { TableRow, TableCell } from '@astrosat/astrosat-ui';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MissionControlTable } from './mission-control-table.component';

const TEST_DATA = ['test-1', 'test-2', 'test-3'];

const columnHeaders = TEST_DATA.map(t => (
  <TableCell key={t}>{`${t}-header`}</TableCell>
));

const testRows = TEST_DATA.map(row => (
  <TableRow key={row}>
    <TableCell>{row}</TableCell>
  </TableRow>
));

const renderComponent = ({ rows = testRows }) => {
  const utils = render(
    <MissionControlTable
      rows={rows}
      columnHeaders={columnHeaders}
      noDataMessage="Test Message"
    />,
  );

  return { ...utils };
};

describe('MissionControlTable', () => {
  it('renders a table', () => {
    const { getByText } = renderComponent({});

    TEST_DATA.forEach(entry => {
      expect(getByText(entry)).toBeInTheDocument();
    });

    TEST_DATA.forEach(entry => {
      expect(getByText(`${entry}-header`)).toBeInTheDocument();
    });
  });

  it('shows noDataMessage if rows prop is null', () => {
    const { getByText } = renderComponent({ rows: null });

    expect(getByText('Test Message')).toBeInTheDocument();
  });

  it('shows noDataMessage if rows prop is empty array', () => {
    const { getByText } = renderComponent({ rows: [] });

    expect(getByText('Test Message')).toBeInTheDocument();
  });

  it('changes pages if multiple pages and Next button is clicked', () => {
    const { getByText, queryByText } = renderComponent({
      rows: [...testRows, ...testRows, 'i-am-on-page-2'],
    });

    expect(queryByText('i-am-on-page-2')).not.toBeInTheDocument();

    userEvent.click(getByText('Next'));

    expect(getByText('i-am-on-page-2')).toBeInTheDocument();
  });

  it('changes pages if multiple pages and page number is clicked', () => {
    const { getByText, queryByText } = renderComponent({
      rows: [...testRows, ...testRows, 'i-am-on-page-2'],
    });

    expect(queryByText('i-am-on-page-2')).not.toBeInTheDocument();

    userEvent.click(getByText('2'));

    expect(getByText('i-am-on-page-2')).toBeInTheDocument();
  });

  it('extends number of rows if select is changed', () => {
    const { getByText } = renderComponent({
      rows: [...testRows, ...testRows, 'i-am-row-7'],
    });

    userEvent.click(getByText('5'));
    userEvent.click(getByText('10'));

    expect(getByText('i-am-row-7')).toBeInTheDocument();
  });
});
