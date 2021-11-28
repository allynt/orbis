import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Table } from './table.component';

const columns = [
  { Header: 'Value', accessor: 'value' },
  { Header: 'Square', accessor: 'square' },
];

const makeData = (n = 5) =>
  Array(n)
    .fill()
    .map((_, i) => ({ value: i, square: i * i }));

describe('<Table />', () => {
  it("Shows the no data message when there's no data", () => {
    const noDataMessage = "There's no data";
    const { getByText } = render(
      <Table columns={columns} data={[]} noDataMessage={noDataMessage} />,
    );
    expect(getByText(noDataMessage)).toBeInTheDocument();
  });

  it('Has working pagination', () => {
    const { getByRole, getByText, queryByText } = render(
      <Table columns={columns} data={makeData(7)} />,
    );
    expect(queryByText('6')).not.toBeInTheDocument();
    expect(queryByText('36')).not.toBeInTheDocument();
    userEvent.click(getByRole('button', { name: 'Go to next page' }));
    expect(getByText('6')).toBeInTheDocument();
    expect(getByText('36')).toBeInTheDocument();
  });

  it("Doesn't show pagination controls if there's less than 5 rows", () => {
    const { getByRole, queryByRole, rerender } = render(
      <Table columns={columns} data={makeData(4)} />,
    );
    expect(
      queryByRole('button', { name: 'Go to next page' }),
    ).not.toBeInTheDocument();
    expect(
      queryByRole('button', { name: 'Go to previous page' }),
    ).not.toBeInTheDocument();
    rerender(<Table columns={columns} data={makeData(7)} />);
    expect(
      getByRole('button', { name: 'Go to next page' }),
    ).toBeInTheDocument();
    expect(
      getByRole('button', { name: 'Go to previous page' }),
    ).toBeInTheDocument();
  });
});
