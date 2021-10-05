import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MySupplyLynkDialog } from './dialog.component';

describe('Dialog', () => {
  let onCloseClick = jest.fn();
  let isVisible = true;
  let supplier = {
    'Address Line 1': '2 Williamfield Square',
    'Address Line 2': 'East Lothian',
    City: 'Edinburgh',
    'Contact Email Address': 'joe@joesbutcher.com',
    'Contact Name': 'Joe',
    'Contact Phone Number': '07561866337',
    County: 'City of Edinburgh',
    Items: [
      {
        Category: 'PPE',
        'Delivery Frequency': 'every so often',
        Name: 'Masks (Surgical)',
        'Supply Capacity (Units Per Week)': '100',
        'Supply Lead Time (Days)': '1',
      },
      {
        Category: 'Miscellaneous',
        'Delivery Frequency': 'every so often',
        Name: 'something else',
        'Supply Capacity (Units Per Week)': '100',
        'Supply Lead Time (Days)': '1',
      },
    ],
    'Line of Business': 'Meat',
    Name: "Joe's Butcher",
    'New Product Lines': 'Bleached Meat',
    'Payment Terms': '',
    Postcode: 'EH15 1AS',
    URL: 'http://www.joesbutchers.com',
  };

  it('renders a dialog with data about supplier', () => {
    const { getAllByText } = render(
      <MySupplyLynkDialog
        supplier={supplier}
        onCloseClick={onCloseClick}
        isVisible={isVisible}
      />,
    );

    const testMultipleFields = data => {
      const results = getAllByText(data);

      expect(results.length).toBeGreaterThan(0);

      results.forEach(res => {
        expect(res).toBeInTheDocument();
      });
    };

    Object.keys(supplier).forEach(key => {
      if (Array.isArray(supplier[key])) {
        supplier[key].forEach(obj => {
          Object.keys(obj).forEach(key => testMultipleFields(obj[key]));
        });
      } else if (typeof supplier[key] === 'object') {
        Object.keys(supplier[key]).forEach(key =>
          testMultipleFields(supplier[key][key]),
        );
      } else if (typeof supplier[key] === 'string') {
        testMultipleFields(supplier[key]);
      }
    });
  });

  it('displays `Not available` fallback when data is not present', () => {
    const { getAllByText } = render(
      <MySupplyLynkDialog
        onCloseClick={onCloseClick}
        isVisible={isVisible}
        supplier={{
          'Line of Business': '',
          'New Product Lines': undefined,
          'Payment Terms': null,
          Items: [],
        }}
      />,
    );

    const notAvailable = getAllByText('Not available');
    expect(notAvailable.length).toEqual(3);
  });

  it('does not render list items if data is not present', () => {
    const testSupplier = {
      'Contact Name': '',
      'Contact Email Address': undefined,
      'Address Line 1': null,
      Items: [],
    };
    const { queryByTestId } = render(
      <MySupplyLynkDialog
        onCloseClick={onCloseClick}
        isVisible={isVisible}
        supplier={testSupplier}
      />,
    );

    expect(queryByTestId('contact-name')).not.toBeInTheDocument();
    expect(queryByTestId('contact-email')).not.toBeInTheDocument();
    expect(queryByTestId('address-line-1')).not.toBeInTheDocument();
  });

  it('closes dialog when `close` button clicked', () => {
    const { getByRole } = render(
      <MySupplyLynkDialog
        supplier={supplier}
        onCloseClick={onCloseClick}
        isVisible={isVisible}
      />,
    );

    userEvent.click(getByRole('button', { name: /Close/i }));
    expect(onCloseClick).toHaveBeenCalled();
  });
});
