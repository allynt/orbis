import * as React from 'react';
import { CategoryBreakdownChart } from './category-breakdown-chart.component';

export default { title: 'Analysis Panel/Category Breakdown Chart' };

const PROPERTY = {
  type: 'discrete',
  name: 'fruit',
  label: 'Fruit',
  categories: {
    Apples: {
      color: '#8db600',
    },
    Oranges: {
      color: '#ffa500',
    },
    Lemons: {
      color: '#ffff00',
    },
    Limes: {
      color: '#32CD32',
    },
  },
};

const Template = args => (
  <CategoryBreakdownChart selectedProperty={PROPERTY} {...args} />
);

export const OneArea = Template.bind({});
OneArea.args = {
  clickedFeatures: [
    {
      object: {
        properties: {
          fruit: 'Apples',
        },
      },
    },
  ],
};

export const Default = Template.bind({});
Default.args = {
  clickedFeatures: [
    {
      object: {
        properties: {
          fruit: 'Apples',
        },
      },
    },
    {
      object: {
        properties: {
          fruit: 'Lemons',
        },
      },
    },
    {
      object: {
        properties: {
          fruit: 'Limes',
        },
      },
    },
  ],
};
