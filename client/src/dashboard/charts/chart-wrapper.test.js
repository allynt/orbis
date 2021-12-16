import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { ChartWrapper } from './chart-wrapper.component';

const title = 'Test Title';
const info = 'It is a test info message';

describe('< ChartWrapper/>', () => {
  it('the info icon should be visible', () => {
    render(
      <ChartWrapper title={title} info={info}>
        {<div>Test Children</div>}
      </ChartWrapper>,
    );
    expect(screen.getByRole('img', { name: 'Info' })).toBeInTheDocument();
  });

  it('should render the info icon message when user clicks on it', () => {
    render(
      <ChartWrapper title={title} info={info}>
        <div>Test Children</div>
      </ChartWrapper>,
    );
    userEvent.click(screen.getByRole('button', { name: 'Info' }));
    expect(screen.getByText(info)).toBeInTheDocument();
  });

  it('should render the title', () => {
    render(
      <ChartWrapper title={title} info={info}>
        <div>Test Children</div>
      </ChartWrapper>,
    );
    expect(
      screen.getByRole('heading', { name: 'Test Title' }),
    ).toBeInTheDocument();
  });
});
