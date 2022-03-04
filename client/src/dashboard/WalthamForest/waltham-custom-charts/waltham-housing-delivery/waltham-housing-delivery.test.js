import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WalthamHousingDelivery } from './waltham-housing-delivery.component';

const tenures = {
    'Affordable Rent': 303,
    Intermediate: 130,
    Market: 124,
    'Social Rented': 127,
    'Private Rented Sector': 198,
  },
  data = [
    {
      Year: '2014-2015',
      ...tenures,
    },
    {
      Year: '2015-2016',
      ...tenures,
    },
    {
      Year: '2016-2017',
      ...tenures,
    },
    {
      Year: '2017-2018',
      ...tenures,
    },
    {
      Year: '2018-2019',
      ...tenures,
    },
    {
      Year: '2019-2020',
      ...tenures,
    },
  ],
  defaultData = {
    tenureHousingDeliveryChartData: [
      {
        name: 'Gross',
        data,
      },
      {
        name: 'Net',
        data,
      },
    ],
    targets: {},
    settings: {},
    setDashboardSettings: jest.fn(),
  };

describe('WalthamHousingDelivery', () => {
  describe('filters', () => {
    it('sets default values if no saved settings', () => {
      const { getByRole } = render(<WalthamHousingDelivery {...defaultData} />);

      expect(defaultData.setDashboardSettings).toHaveBeenCalledTimes(1);
      expect(
        getByRole('button', { name: '2015-2016 - 2019-2020' }),
      ).toBeInTheDocument();

      expect(
        getByRole('button', { name: 'All Tenure Types' }),
      ).toBeInTheDocument();

      // expect(getByRole('button', { name: 'Gross' })).toBeInTheDocument();
    });

    it('defaults to user`s saved settings if present', () => {
      const settings = {
        tenureYear: '2018-2019',
        tenureType: 'sociallyRented',
        tenureDateType: 'Net',
      };

      const { getByRole } = render(
        <WalthamHousingDelivery {...defaultData} settings={settings} />,
      );

      expect(defaultData.setDashboardSettings).not.toHaveBeenCalled();

      expect(
        getByRole('button', { name: '2014-2015 - 2018-2019' }),
      ).toBeInTheDocument();
      expect(
        getByRole('button', { name: 'Social Rented' }),
      ).toBeInTheDocument();
      // expect(getByRole('button', { name: 'Net' })).toBeInTheDocument();
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

      // will update once as usual, then again to correct itself if invalid.
      expect(defaultData.setDashboardSettings).toHaveBeenCalledTimes(2);
      expect(getByText('2015-2016 - 2019-2020')).toBeInTheDocument();
    });

    it('calls setDashboardSettings function when filters are changed', () => {
      const { getByRole } = render(
        <WalthamHousingDelivery
          {...defaultData}
          settings={{ tenureYear: '2019-2020' }}
        />,
      );

      userEvent.click(getByRole('button', { name: 'All Tenure Types' }));
      userEvent.click(getByRole('option', { name: 'Market' }));

      expect(defaultData.setDashboardSettings).toHaveBeenCalledTimes(1);
    });
  });
});
