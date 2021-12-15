import React from 'react';

import { render, screen } from 'test/test-utils';

import * as data from '../mock-data/waltham-forest/mock_approvals_granted';
import { ChartWrapper } from './chart-wrapper.component';

console.log(data);
const title = 'Hello';
const info = 'There is an info message';
// const children = 'There is some info';
describe('< ChartWrapper/>', () => {
  it('should render the proper name of column header ', () => {
    render(<ChartWrapper title={title} info={info} children={children} />);
    expect(screen.getByRole('button', { name: 'Info' }));
  });
});
