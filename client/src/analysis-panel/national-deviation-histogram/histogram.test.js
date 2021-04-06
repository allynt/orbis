import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Histogram } from './histogram.component';
import userEvent from '@testing-library/user-event';

const renderComponent = (line, log = false) =>
  render(
    <Histogram
      domain={[0, 10]}
      line={line}
      data={[
        {
          x: 134,
          y: 15015,
        },
        {
          x: 402,
          y: 23278,
        },
        {
          x: 670,
          y: 2953,
        },
        {
          x: 938,
          y: 383,
        },
        {
          x: 1206,
          y: 70,
        },
        {
          x: 1474,
          y: 18,
        },
        {
          x: 1742,
          y: 8,
        },
        {
          x: 2010,
          y: 2,
        },
        {
          x: 2278,
          y: 1,
        },
        {
          x: 2546,
          y: 1,
        },
      ]}
    />,
  );

describe('<Histogram />', () => {
  it('shows a line if line value is provided', () => {
    const { getByTestId } = renderComponent(5);
    expect(getByTestId('line')).toBeInTheDocument();
  });

  it('does not show a line if line is not a real value', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('line')).not.toBeInTheDocument();
  });

  it('Sets the scale to log when the log button is clicked', async () => {
    const { getByText, getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Log' }));
    await waitFor(() => expect(getByText('10 k')).toBeInTheDocument());
  });

  it('Sets the scale to linear when the linear button is clicked', async () => {
    const { getByText, getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Lin' }));
    await waitFor(() => expect(getByText('20000')).toBeInTheDocument());
  });
});
