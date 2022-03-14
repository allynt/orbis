import React from 'react';

import * as mockData from 'dashboard/mock-data/waltham-forest/mock_affordable_housing';
import { render, screen } from 'test/test-utils';

import { AffordableHousingDelivery } from './affordable-housing-delivery.component';

const data = mockData.properties[0].data;

const setDashboardSettings = jest.fn();
const targets = {
  affordableHousingPercentage: {
    2013: 100,
    2014: 100,
    2015: 200,
    2016: 200,
    2017: 100,
    2018: 100,
    2019: 100,
    2020: 100,
    2021: 100,
    2022: 150,
    2023: 100,
  },
};
const settings = { affordableHousingTotalYear: 2022 };

describe('<AfforableHousingDelivery />', () => {
  it('shows the right title in the wrapper', () => {
    render(
      <AffordableHousingDelivery
        data={data}
        settings={settings}
        targets={targets}
        setDashboardSettings={setDashboardSettings}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: `Affordable Housing Delivery (%)`,
      }),
    ).toBeInTheDocument();
  });

  it('shows the right axis labels', () => {
    render(
      <AffordableHousingDelivery
        data={data}
        settings={settings}
        targets={targets}
        setDashboardSettings={setDashboardSettings}
      />,
    );
    expect(screen.getByText('Affordable Housing %')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
  });
});
