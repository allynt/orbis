import React from 'react';

import MySupplyLynkFeatureDetail from './mysupplylynk-feature-detail.component';

const Index = { title: 'Orbs/MySupplyLynk/Feature Detail' };

export default Index;

const supplier1 = {
  Name: 'Test Supplier',
  'Address Line 1': '1 Test Street',
  'Address Line 2': 'Testington',
  Postcode: 'TE5 7IN',
  URL: 'www.test.com',
  Items: [{ Category: 'Test' }, { Category: 'Icicle' }],
};

export const OneSupplier = () => (
  <MySupplyLynkFeatureDetail data={[supplier1]} />
);

export const MultipleSuppliers = () => (
  <MySupplyLynkFeatureDetail
    data={[
      supplier1,
      {
        Name: 'Other Supplier',
        'Address Line 1': '2 Other street',
        'Address Line 2': 'Otherhall',
        Postcode: 'OT4 3RA',
        URL: 'www.other.com',
        Items: [
          { Category: 'Other' },
          { Category: 'Clover' },
          { Category: 'Clover' },
          { Category: 'Clover' },
          { Category: 'Clover' },
          { Category: 'Clover' },
          { Category: 'Clover' },
          { Category: 'Clover' },
        ],
      },
    ]}
  />
);

export const LoadsOfSuppliers = () => (
  <MySupplyLynkFeatureDetail
    data={new Array(50).fill(undefined).map((_, i) => ({
      Name: `Test Supplier ${i}`,
      'Address Line 1': `${i} Test Street`,
      'Address Line 2': 'Testington',
      Postcode: 'TE5 7IN',
      URL: 'www.test.com',
      Items: [{ Category: 'Test' }, { Category: 'Icicle' }, { Category: i }],
    }))}
  />
);
