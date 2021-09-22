import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from 'faker/locale/en_GB';

import { ColorLegend } from './color-legend.component';

if (isChromatic()) faker.seed(1);

export default {
  title: 'Components/ColorLegend',
  component: ColorLegend,
};

const Template = args => <ColorLegend {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  categories: Array(10)
    .fill(undefined)
    .map(() => ({
      category: faker.commerce.department(),
    }))
    .reduce((prev, { category }) => ({ ...prev, [category]: {} }), {}),
};

export const WithColor = Template.bind({});
WithColor.args = {
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
};

export const WithDescription = Template.bind({});
WithDescription.args = {
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
};
