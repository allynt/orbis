import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import ProgressIndicators from './progress-indicators.component';

const data = [
  {
    name: 'Dissolved Oxygen',
    info: 'Dissolved Oxygen Info',
    data: [
      {
        x: 1,
        y: 533.8,
      },
      {
        x: 2,
        y: -433.79999999999995,
      },
    ],
    dateUpdated: '2022-06-09 16-52-16',
  },
  {
    name: 'Electrical Conductivity',
    info: 'Electrical Conductivity Info',
    data: [
      {
        x: 1,
        y: 45.4,
      },
      {
        x: 2,
        y: 54.6,
      },
    ],
    dateUpdated: '2022-06-09 16-52-16',
  },
  {
    name: 'pH',
    info: 'pH Info',
    data: [
      {
        x: 1,
        y: 69.3,
      },
      {
        x: 2,
        y: 30.700000000000003,
      },
    ],
    dateUpdated: '2022-06-09 16-52-16',
  },
  {
    name: 'Temperature',
    info: 'Temperature Info',
    data: [
      {
        x: 1,
        y: 29.6,
      },
      {
        x: 2,
        y: 70.4,
      },
    ],
    dateUpdated: '2022-06-09 16-52-16',
  },
];

const renderComponent = data => {
  const component = render(<ProgressIndicators data={data} />);
  return { ...component };
};

describe('H2Orb Dashboard', () => {
  it('shows skeletons if no data', () => {
    renderComponent(null);
    expect(screen.getAllByRole('skeleton')).toHaveLength(4);
  });
});
