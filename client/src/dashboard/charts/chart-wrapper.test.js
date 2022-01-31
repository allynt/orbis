import React from 'react';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import { ChartWrapper } from './chart-wrapper.component';

const TITLE = 'Test Title';
const INFO = 'It is a test info message';

describe('< ChartWrapper/>', () => {
  it('should render the title', () => {
    render(
      <ChartWrapper title={TITLE} info={INFO}>
        <div>Test Children</div>
      </ChartWrapper>,
    );
    expect(
      screen.getByRole('heading', { name: 'Test Title' }),
    ).toBeInTheDocument();
  });

  it('the info icon should be visible', () => {
    render(
      <ChartWrapper title={TITLE} info={INFO}>
        <div>Test Children</div>
      </ChartWrapper>,
    );
    expect(screen.getByRole('img', { name: 'Info' })).toBeInTheDocument();
  });

  it('should not render the info icon when info prop is not pass ', () => {
    render(
      <ChartWrapper title={TITLE}>
        <div>Test Children</div>
      </ChartWrapper>,
    );
    expect(screen.queryByRole('img', { name: 'Info' })).not.toBeInTheDocument();
  });

  it('should render the info icon message when user clicks on it', async () => {
    render(
      <ChartWrapper title={TITLE} info={INFO}>
        <div>Test Children</div>
      </ChartWrapper>,
    );
    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'Info' })),
    );
    expect(screen.getByText(INFO)).toBeInTheDocument();
  });
});
