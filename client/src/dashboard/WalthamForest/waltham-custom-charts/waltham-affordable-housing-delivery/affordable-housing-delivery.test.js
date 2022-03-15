import React from 'react';

import * as mockData from 'dashboard/mock-data/waltham-forest/mock_affordable_housing';
import { render, screen } from 'test/test-utils';

import { AffordableHousingDelivery } from './affordable-housing-delivery.component';

const data = mockData.properties[0].data,
  targets = {
    2018: 100,
    2019: 70,
    2020: 80,
    2021: 120,
    2022: 90,
  };

describe('<AfforableHousingDelivery />', () => {
  it('shows the right title in the wrapper', () => {
    render(<AffordableHousingDelivery data={data} targets={targets} />);

    expect(
      screen.getByRole('heading', {
        name: `Affordable Housing Delivery (%)`,
      }),
    ).toBeInTheDocument();
  });

  it('shows the right axis labels', () => {
    render(<AffordableHousingDelivery data={data} targets={targets} />);
    expect(
      screen.getByText('Affordable Housing Delivery 2018 - 2023 (%)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
  });
});
