import faker from 'faker/locale/en_GB';
import * as React from 'react';
import { ClickedFeaturesSummary } from './clicked-features-summary.component';
import isChromatic from 'chromatic/isChromatic';

if (isChromatic()) faker.seed(1);

const createFeature = (_, i) => ({
  object: {
    properties: {
      index: faker.random.alphaNumeric(5),
      area_name: faker.address.county(),
      population: faker.random.number(10000),
      population_year: '2011',
      households: faker.random.number(1000),
    },
  },
});

export default {
  title: 'Analysis Panel/Clicked Features Summary',
  argTypes: { dispatch: { action: 'dispatch' } },
};

const Template = args => <ClickedFeaturesSummary {...args} />;

export const NoClickedFeatures = Template.bind({});

export const ClickedFeatures = Template.bind({});
ClickedFeatures.args = {
  clickedFeatures: Array(3).fill(undefined).map(createFeature),
};

export const LotsOfFeatures = Template.bind({});
LotsOfFeatures.args = {
  clickedFeatures: Array(50).fill(undefined).map(createFeature),
};
