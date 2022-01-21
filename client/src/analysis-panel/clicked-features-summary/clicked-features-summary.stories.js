import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from '@faker-js/faker/locale/en_GB';

import { AnalysisPanelProvider } from 'analysis-panel/analysis-panel-context';

import { ClickedFeaturesSummary } from './clicked-features-summary.component';

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

const Template = args => {
  return (
    <AnalysisPanelProvider clickedFeatures={args.clickedFeatures}>
      <ClickedFeaturesSummary {...args} />
    </AnalysisPanelProvider>
  );
};

export const NoClickedFeatures = Template.bind({});

export const ClickedFeatures = Template.bind({});
const aFewFeatures = Array(3).fill(undefined).map(createFeature);
ClickedFeatures.args = {
  clickedFeatures: aFewFeatures,
};

export const LotsOfFeatures = Template.bind({});
const lotsOfFeatures = Array(50).fill(undefined).map(createFeature);
LotsOfFeatures.args = {
  clickedFeatures: lotsOfFeatures,
};
