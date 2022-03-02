import React from 'react';

import * as MOCK_DATA from 'dashboard/mock-data/waltham-forest/mock_affordable_housing';
import { render, screen, waitFor } from 'test/test-utils';

import { AffordableHousingDelivery } from './affordable-housing-delivery.component';

const userOrbState = {
  AffordableHousingDelivery: {
    '2018 - 2019': 100,
    '2019 - 2020': 70,
    '2020 - 2021': 80,
    '2021 - 2022': 120,
    '2022 - 2023': 90,
  },
};

describe('<AfforableHousingDelivery />', () => {
  it('shows the right title in the wrapper', async () => {
    render(
      <AffordableHousingDelivery
        data={MOCK_DATA}
        userOrbState={userOrbState}
      />,
    );

    await waitFor(() =>
      expect(
        screen.getByRole('heading', {
          name: 'Affordable Housing Delivery 2018 - 2023 (%)',
        }),
      ).toBeInTheDocument(),
    );
  });

  it('shows the right axis labels', async () => {
    render(
      <AffordableHousingDelivery
        data={MOCK_DATA}
        userOrbState={userOrbState}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText('Affordable Housing %')).toBeInTheDocument(),
    );
    expect(screen.getByText('Year')).toBeInTheDocument();
  });
});
