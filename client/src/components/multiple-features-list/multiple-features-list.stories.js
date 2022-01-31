import * as React from 'react';

import faker from '@faker-js/faker';
import isChromatic from 'chromatic/isChromatic';

import { MultipleFeaturesList } from './multiple-features-list.component';

if (isChromatic()) faker.seed(1);

export default {
  title: 'Components/Multiple Features List',
  argTypes: { onMoreDetailsClick: { action: true } },
};

const FEATURES = Array(5)
  .fill(undefined)
  .map(() => ({
    properties: {
      Model: faker.vehicle.model(),
      Manufacturer: faker.vehicle.manufacturer(),
      Type: faker.vehicle.type(),
    },
  }));

const Template = args => <MultipleFeaturesList features={FEATURES} {...args} />;

export const Default = Template.bind();

export const PrimaryProperty = Template.bind();
PrimaryProperty.args = {
  primaryProperty: 'Manufacturer',
};

export const SecondaryProperty = Template.bind();
SecondaryProperty.args = {
  secondaryProperty: 'Model',
};

export const PrimaryAndSecondaryProperties = Template.bind();
PrimaryAndSecondaryProperties.args = {
  ...PrimaryProperty.args,
  ...SecondaryProperty.args,
};
