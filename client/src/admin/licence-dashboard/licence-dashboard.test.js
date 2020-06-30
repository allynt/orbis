import React from 'react';
import { render } from '@testing-library/react';
import { LicenceDashboard } from './licence-dashboard.component';

const licences = [
  { orb: 'Rice', customer_user: 1 },
  { orb: 'Rice', customer_user: 2 },
  { orb: 'Rice' },
  { orb: 'Oil', customer_user: 1 },
  { orb: 'Oil', customer_user: 3 },
  { orb: 'Health', customer_user: '1' },
  { orb: 'Health', customer_user: 3 },
  { orb: 'Health', customer_user: 2 },
  { orb: 'Health' },
  { orb: 'Health' },
];

describe('<LicenceDashboard />', () => {
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty array', []],
  ])('Displays text when licences are %s', (_, value) => {
    const { getByText } = render(<LicenceDashboard licences={value} />);
    expect(getByText('No Licences Available')).toBeInTheDocument();
  });

  it('Displays a row for each orb', () => {
    const { getByText } = render(<LicenceDashboard licences={licences} />);
    ['Rice', 'Oil', 'Health'].forEach(orb => expect(getByText(orb)).toBeInTheDocument());
  });

  it('Displays the total purchased licences for each orb', () => {
    const { getByText } = render(<LicenceDashboard licences={licences} />);
    [
      ['Rice', '3'],
      ['Oil', '2'],
      ['Health', '5'],
    ].forEach(([orb, count]) => expect(getByText(orb).parentElement).toHaveTextContent(count));
  });

  it('Displays the total active licences for each orb', () => {
    const { getByText } = render(<LicenceDashboard licences={licences} />);
    [
      ['Rice', '2'],
      ['Oil', '2'],
      ['Health', '3'],
    ].forEach(([orb, count]) => expect(getByText(orb).parentElement).toHaveTextContent(count));
  });

  it('Displays the total available licences for each orb', () => {
    const { getByText } = render(<LicenceDashboard licences={licences} />);
    [
      ['Rice', '1'],
      ['Oil', '0'],
      ['Health', '2'],
    ].forEach(([orb, count]) => expect(getByText(orb).parentElement).toHaveTextContent(count));
  });
});
