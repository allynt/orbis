import faker from 'faker/locale/en_GB';
import * as React from 'react';
import { DiscretePropertyLegend } from './discrete-property-legend.component';
import isChromatic from 'chromatic/isChromatic';

if (isChromatic()) faker.seed(1);

export default {
  title: 'Orbs/Isolation Plus/Radio Picker/Discrete Property Legend',
};

const Template = args => <DiscretePropertyLegend {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  property: {
    categories: Array(10)
      .fill(undefined)
      .map(() => ({
        category: faker.commerce.department(),
      }))
      .reduce((prev, { category }) => ({ ...prev, [category]: {} }), {}),
  },
};

export const WithColor = Template.bind({});
WithColor.args = {
  property: {
    categories: Array(10)
      .fill(undefined)
      .map(() => ({
        category: faker.commerce.department(),
        color: faker.internet.color(),
      }))
      .reduce(
        (prev, { category, ...rest }) => ({ ...prev, [category]: rest }),
        {},
      ),
  },
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  property: {
    categories: Array(10)
      .fill(undefined)
      .map(() => ({
        category: faker.commerce.department(),
        description: faker.lorem.paragraph(),
      }))
      .reduce(
        (prev, { category, ...rest }) => ({ ...prev, [category]: rest }),
        {},
      ),
  },
};
