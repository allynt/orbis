import React from 'react';
import FeatureDetail from './feature-detail.component';

export default { title: 'Map/Feature Detail', component: FeatureDetail };

export const NoFeatures = () => <FeatureDetail features={[]} />;

export const SingleFeature = () => (
  <FeatureDetail
    features={[
      {
        Type: 'Volunteer',
        name: 'Test Person',
        email: 'test@test.com',
      },
    ]}
  />
);

export const MultipleFeatures = () => (
  <FeatureDetail
    features={[
      {
        Type: 'Volunteer',
        name: 'Test Person',
        email: 'test@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
    ]}
  />
);

export const LotsOfFeatures = () => (
  <FeatureDetail
    features={[
      {
        Type: 'Volunteer',
        name: 'Test Person',
        email: 'test@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
      {
        Type: 'Recipient',
        name: 'Test Person 2',
        email: 'test2@test.com',
      },
    ]}
  />
);
