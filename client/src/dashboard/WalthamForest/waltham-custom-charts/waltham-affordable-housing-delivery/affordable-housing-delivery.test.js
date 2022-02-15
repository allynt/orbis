import React from 'react';

import * as MOCK_DATA from 'dashboard/mock-data/waltham-forest/mock_affordable_housing';
import { render, screen, waitFor } from 'test/test-utils';

import { AffordableHousingDelivery } from './affordable-housing-delivery.component';

describe('<AfforableHousingDelivery />', () => {
  it('shows the right title in the wrapper', async () => {
    render(<AffordableHousingDelivery data={MOCK_DATA} />);

    await waitFor(() =>
      expect(
        screen.getByRole('heading', {
          name: 'Affordable Housing Delivery 2016 - 2021 (%)',
        }),
      ).toBeInTheDocument(),
    );
  });

  it('shows the right axis labels', async () => {
    render(<AffordableHousingDelivery data={MOCK_DATA} />);
    await waitFor(() =>
      expect(screen.getByText('Affordable Housing %')).toBeInTheDocument(),
    );
    expect(screen.getByText('Year')).toBeInTheDocument();
  });
});
