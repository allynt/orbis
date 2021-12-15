import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { ChartWrapper } from './chart-wrapper.component';

const title = 'Test Title';
const info = 'It is a test info message';
describe('< ChartWrapper/>', () => {
  it('the info icon should be visible if exist', () => {
    render(<ChartWrapper title={title} info={info} children={[]} />);
    expect(screen.getByRole('img', { name: 'Info' })).toBeInTheDocument();
  });

  it('should render the info icon message when user clicks on it', () => {
    render(<ChartWrapper title={title} info={info} children={[]} />);
    userEvent.click(screen.getByRole('button', { name: 'Info' }));
    expect(screen.getByText(info)).toBeInTheDocument();
    console.log(info);
  });

  it('should render the info icon message when user clicks on it', () => {
    render(<ChartWrapper title={title} info={info} children={[]} />);
    userEvent.click(screen.getByRole('button', { name: 'Info' }));
    expect(screen.getByText(info)).toBeInTheDocument();
  });
});
