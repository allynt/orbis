import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Histogram } from './histogram.component';

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
  it('renders', () => {
    renderComponent(5);
  });

  it('Sets the scale to log when the log button is clicked', async () => {
    const { getByText, getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Log' }));
    await waitFor(() => expect(getByText('20 k')).toBeInTheDocument());
  });

  it('Sets the scale to linear when the linear button is clicked', async () => {
    const { getByText, getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Linear' }));
    await waitFor(() => expect(getByText('20000')).toBeInTheDocument());
  });
});
