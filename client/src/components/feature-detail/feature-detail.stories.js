import React from 'react';
import FeatureDetail from './feature-detail.component';

export default { title: 'Map/Feature Detail', component: FeatureDetail };

export const NoFeatures = () => <FeatureDetail />;

export const SingleFeature = () => (
  <FeatureDetail
    features={[
      {
        properties: {
          Type: 'Volunteer',
          name: 'Test Person',
          email: 'test@test.com',
        },
      },
    ]}
  />
);

export const MultipleFeatures = () => (
  <FeatureDetail
    features={[
      {
        properties: {
          Type: 'Volunteer',
          name: 'Test Person',
          email: 'test@test.com',
        },
      },
      {
        properties: {
          Type: 'Recipient',
          name: 'Test Person 2',
          email: 'test2@test.com',
        },
      },
    ]}
  />
);
