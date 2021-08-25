import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Table } from './table.component';

const columns = [
  { Header: 'Value', accessor: 'value' },
  { Header: 'Square', accessor: 'square' },
];

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
      <Table
        columns={columns}
        data={Array(7)
          .fill()
          .map((_, i) => ({ value: i, square: i * i }))}
      />,
    );
    expect(queryByText('6')).not.toBeInTheDocument();
    expect(queryByText('36')).not.toBeInTheDocument();
    userEvent.click(getByRole('button', { name: 'Go to next page' }));
    expect(getByText('6')).toBeInTheDocument();
    expect(getByText('36')).toBeInTheDocument();
  });
});
