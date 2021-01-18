import { omit } from 'lodash';
import * as React from 'react';
import { NationalDeviationHistogram } from './national-deviation-histogram.component';

const selectedProperty = {
  max: 2677,
  min: 0,
  label: 'Number of people in the age band 0-17',
  clip_max: 826,
  clip_min: 39,
  aggregates: {
    GB: 13682669,
    Wales: 629939,
    England: 12023568,
    Scotland: 1029162,
  },
  aggregation: 'sum',
  application: {
    orbis: {
      label: 'People in the age band 0-17',
      display: {
        color: 'viridis',
        colormap_type: 'neutral_sequential',
        colormap_reversed: false,
      },
      data_visualisation_components: {
        name: 'Bar',
        props: {
          data: [
            {
              x: 134,
              y: 15015,
            },
            {
              x: 402,
              y: 23278,
            },
            {
              x: 670,
              y: 2953,
            },
            {
              x: 938,
              y: 383,
            },
            {
              x: 1206,
              y: 70,
            },
            {
              x: 1474,
              y: 18,
            },
            {
              x: 1742,
              y: 8,
            },
            {
              x: 2010,
              y: 2,
            },
            {
              x: 2278,
              y: 1,
            },
            {
              x: 2546,
              y: 1,
            },
          ],
        },
      },
    },
  },
};

export default { title: 'Analysis Panel/National Deviation Histogram' };

const Template = args => <NationalDeviationHistogram {...args} />;

export const Default = Template.bind({});
Default.args = {
  areaValue: 1000,
  selectedProperty,
};

export const NoAggregates = Template.bind({});
NoAggregates.args = {
  ...Default.args,
  selectedProperty: omit(selectedProperty, 'aggregates'),
};
