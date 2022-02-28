import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WalthamHousingDelivery } from './waltham-housing-delivery.component';

const tenures = {
  'Affordable Rent': 303,
  Intermediate: 130,
  Market: 124,
  'Social Rented': 127,
  'Private Rented Sector': 198,
};

const defaultData = {
  tenureHousingDeliveryChartData: [
    {
      name: 'Gross',
      data: [
        {
          Year: '2015-2016',
          ...tenures,
        },
        {
          Year: '2016-2017',
          ...tenures,
        },
      ],
    },
    {
      name: 'Net',
      data: [
        {
          Year: '2015-2016',
          ...tenures,
        },
        {
          Year: '2016-2017',
          ...tenures,
        },
      ],
    },
  ],
  targets: {},
  settings: {},
  setDashboardSettings: jest.fn(),
};

describe('WalthamHousingDelivery', () => {
  describe('filters', () => {
    xit('sets default values if no saved settings', () => {
      const { getByRole } = render(<WalthamHousingDelivery {...defaultData} />);

      expect(getByRole('button', { name: '2016-2017' })).toBeInTheDocument();

      expect(
        getByRole('button', { name: 'All Tenure Types' }),
      ).toBeInTheDocument();

      expect(getByRole('button', { name: 'Gross' })).toBeInTheDocument();
    });

    it('defaults to user`s saved settings if present', () => {
      const settings = {
        tenureYear: '2015-2016',
        tenureType: 'sociallyRented',
        tenureDateType: 'Net',
      };

      const { getByRole } = render(
        <WalthamHousingDelivery {...defaultData} settings={settings} />,
      );

      expect(getByRole('button', { name: '2015-2016' })).toBeInTheDocument();
      expect(
        getByRole('button', { name: 'Social Rented' }),
      ).toBeInTheDocument();
      expect(getByRole('button', { name: 'Net' })).toBeInTheDocument();
    });

    it('resets to highest available year if year is invalid after switching tenure type', () => {
      const targets = {
          marketHousing: { '2020-2021': 123 },
        },
        settings = {
          tenureYear: '2020-2021',
          tenureType: 'marketHousing',
        };

      const { getByText, getByRole } = render(
        <WalthamHousingDelivery
          {...defaultData}
          targets={targets}
          settings={settings}
        />,
      );

      userEvent.click(getByRole('button', { name: 'Market' }));
      userEvent.click(getByRole('option', { name: 'Social Rented' }));

      expect(getByText('2016-2017')).toBeInTheDocument();
    });

    it.only('calls setDashboardSettings function when filters are changed', () => {
      const { getByRole } = render(<WalthamHousingDelivery {...defaultData} />);

      userEvent.click(getByRole('button', { name: 'All Tenure Types' }));
      userEvent.click(getByRole('button', { name: 'Market' }));

      expect(defaultData.setDashboardSettings).toHaveBeenCalled();
    });
  });
});
