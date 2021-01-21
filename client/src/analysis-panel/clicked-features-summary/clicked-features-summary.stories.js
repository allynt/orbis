import faker from 'faker/locale/en_GB';
import * as React from 'react';
import { ClickedFeaturesSummary } from './clicked-features-summary.component';

const createFeature = (_, i) => ({
  object: {
    properties: {
      index: faker.random.alphaNumeric(5),
      area_name: faker.address.county(),
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
