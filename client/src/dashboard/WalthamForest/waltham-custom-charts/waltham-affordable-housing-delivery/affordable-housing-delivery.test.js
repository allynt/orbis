import React from 'react';

import * as mockData from 'dashboard/mock-data/waltham-forest/mock_affordable_housing';
import { getLastNYearRange } from 'dashboard/WalthamForest/utils';
import { render, screen } from 'test/test-utils';

import { AffordableHousingDelivery } from './affordable-housing-delivery.component';

const data = mockData.properties[0].data,
  targets = {
    affordableHousing: {
      '2018 - 2019': 100,
      '2019 - 2020': 70,
      '2020 - 2021': 80,
      '2021 - 2022': 120,
      '2022 - 2023': 90,
    },
  };

describe('<AfforableHousingDelivery />', () => {
  it('shows the right title in the wrapper', () => {
    render(<AffordableHousingDelivery data={data} targets={targets} />);

    expect(
      screen.getByRole('heading', {
        name: `Affordable Housing Delivery ${getLastNYearRange(5)} (%)`,
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
