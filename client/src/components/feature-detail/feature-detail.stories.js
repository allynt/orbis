import { Button } from '@astrosat/astrosat-ui';
import React from 'react';
import FeatureDetail from './feature-detail.component';

export default { title: 'Components/Feature Detail', component: FeatureDetail };

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
      {
        key1: 'value1',
        object: { subkey1: 'subvalue1', subkey2: 'subvalue2' },
      },
    ]}
  />
);

export const ArrayValues = () => (
  <FeatureDetail
    features={[
      {
        fruitInMyBowl: ['apple', 'orange', 'kiwi', 'banana', 'pomegranate'],
        emptyArray: [],
        nestedArrays: [
          [1, 2],
          [3, 4],
          [5, 6, [7, 8]],
        ],
      },
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

export const BooleanValues = () => (
  <FeatureDetail
    features={[
      {
        true: true,
        false: false,
      },
    ]}
  />
);

export const FalsyValues = () => (
  <FeatureDetail
    features={[
      {
        undefined: undefined,
        null: null,
        emptyString: '',
        zero: 0,
        nullString: 'null',
      },
    ]}
  />
);

export const Paragraphs = () => (
  <FeatureDetail
    features={[
      {
        paragraph1:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Adipiscing tristique risus nec feugiat in fermentum posuere urna. Consectetur a erat nam at lectus urna. At in tellus integer feugiat scelerisque varius morbi enim nunc. Odio morbi quis commodo odio aenean sed. Lectus quam id leo in vitae turpis massa sed elementum. Id nibh tortor id aliquet lectus proin nibh nisl condimentum. Ac tortor dignissim convallis aenean et tortor. Praesent tristique magna sit amet purus gravida. Hac habitasse platea dictumst quisque sagittis purus sit amet. Tincidunt vitae semper quis lectus. Morbi tristique senectus et netus et malesuada fames.',
        paragraph2:
          'Congue mauris rhoncus aenean vel elit scelerisque mauris. Sollicitudin tempor id eu nisl. Viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est. Duis at consectetur lorem donec massa sapien. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Urna cursus eget nunc scelerisque viverra. Posuere morbi leo urna molestie. Risus ultricies tristique nulla aliquet enim. Pellentesque habitant morbi tristique senectus et netus. Sed vulputate mi sit amet mauris commodo. Dui sapien eget mi proin sed libero. Tincidunt augue interdum velit euismod in pellentesque massa placerat duis. Scelerisque felis imperdiet proin fermentum leo vel orci porta. Sed nisi lacus sed viverra tellus in hac. Enim diam vulputate ut pharetra sit amet. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Venenatis urna cursus eget nunc scelerisque.',
      },
    ]}
  />
);

export const Children = () => (
  <FeatureDetail title="I have children">
    <p>Hello</p>
    <p>There</p>
    <Button>Do Stuff</Button>
  </FeatureDetail>
);
