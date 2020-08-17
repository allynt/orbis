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

export const ObjectValues = () => (
  <FeatureDetail
    features={[
      { key1: 'value1', key2: { subkey1: 'subvalue1', subkey2: 'subvalue2' } },
    ]}
  />
);

export const ArrayValues = () => (
  <FeatureDetail
    features={[
      { fruitInMyBowl: ['apple', 'orange', 'kiwi', 'banana', 'pomegranate'] },
    ]}
  />
);

export const ArrayOfObjects = () => (
  <FeatureDetail
    features={[
      {
        fruitInMyBowl: [
          { fruit: 'apple', ripeness: 'overripe' },
          { fruit: 'orange', ripeness: 'ripe' },
          { fruit: 'kiwi', ripeness: 'unripe' },
          { fruit: 'banana', ripeness: 'overripe' },
          { fruit: 'pomegranate', ripeness: 'ripe' },
        ],
      },
    ]}
  />
);
