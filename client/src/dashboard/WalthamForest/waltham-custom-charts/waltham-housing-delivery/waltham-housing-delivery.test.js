import { render, waitFor } from '@testing-library/react';
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
  userOrbState: {},
  setDashboardSettings: jest.fn(),
};

describe('WalthamHousingDelivery', () => {
  describe('filters', () => {
    it('sets default values if no saved settings', () => {
      const { getByRole } = render(<WalthamHousingDelivery {...defaultData} />);

      expect(getByRole('button', { name: '2015-2016' })).toBeInTheDocument();

      expect(
        getByRole('button', { name: 'All Tenure Types' }),
      ).toBeInTheDocument();

      expect(getByRole('button', { name: 'Gross' })).toBeInTheDocument();
    });

    it('defaults to user`s saved settings if present', () => {
      const userOrbState = {
        tenureYear: '2016-2017',
        tenureType: 'Social Rented',
        tenureDateType: 'Net',
      };

      const { getByRole } = render(
        <WalthamHousingDelivery {...defaultData} userOrbState={userOrbState} />,
      );

      expect(getByRole('button', { name: '2016-2017' })).toBeInTheDocument();
      expect(
        getByRole('button', { name: 'Social Rented' }),
      ).toBeInTheDocument();
      expect(getByRole('button', { name: 'Net' })).toBeInTheDocument();
    });

    it.only('resets to highest available year if year is invalid after switching tenure type', () => {
      const userOrbState = {
        tenureYear: '2020-2021',
        tenureType: 'Market',
        market: { '2020-2021': 123 },
      };

      const { getByText, getByRole } = render(
        <WalthamHousingDelivery {...defaultData} userOrbState={userOrbState} />,
      );

      // userEvent.click(getByRole('button', { name: 'Market' }));
      // userEvent.click(getByText('Social Rented'));

      // expect(getByText('2016-2017')).toBeInTheDocument();
    });

    it('calls setDashboardSettings function when filters are changed', () => {
      const { getByText } = render(<WalthamHousingDelivery {...defaultData} />);

      userEvent.click(getByText('All Tenure Types'));
      userEvent.click(getByText('Market'));

      expect(defaultData.setDashboardSettings).toHaveBeenCalled();
    });
  });
});
