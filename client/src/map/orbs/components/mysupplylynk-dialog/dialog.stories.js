import React, { useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { Dialog } from './dialog.component';

export default { title: 'Orbs/MySupplyLynk/Dialog' };

export const Suppler = () => {
  const ref = useRef(null);
  let isVisible = true;
  return (
    <Dialog
      onCloseClick={action('Close')}
      isVisible={isVisible}
      ref={ref}
      supplier={{
        Name: "Joe's Butchers",
        'Line of Business': 'Meat',
        'New Product Lines': 'Bleached Meat',
        'Payment Terms': '',
        'Contact Name': 'Joe',
        'Contact Email Address': 'joe@joesbutchers.com',
        'Contact Phone Number': '07561866337',
        Postcode: 'EH15 1AS',
        'Address Line 1': '2 Williamfield Square',
        'Address Line 2': '',
        City: 'Edinburgh',
        County: 'City of Edinburgh',
        URL: 'http://www.joesbutchers.com',
        Items: [
          {
            Name: 'Masks (Surgical)',
            Category: 'PPE',
            'Supply Capacity (Units Per Week)': '100 units',
            'Supply Lead Time (Days)': '1 day',
            'Delivery Frequency': 'every so often',
          },
          {
            Name: 'something else',
            Category: 'Miscellaneous',
            'Supply Capacity (Units Per Week)': '100 units',
            'Supply Lead Time (Days)': '1 day',
            'Delivery Frequency': 'every so often',
          },
        ],
      }}
    />
  );
};