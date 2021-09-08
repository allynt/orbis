import * as React from 'react';

import { omit } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { AnalysisPanelProvider } from 'analysis-panel/analysis-panel-context';

import { NationalDeviationHistogram } from './national-deviation-histogram.component';

const mockStore = configureMockStore();

const props = {
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
};

const selectedProperty = {
  max: 2677,
  min: 0,
  label: 'Number of people in the age band 0-17',
  name: 'People in the age band 0-17',
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
    },
  },
};

export default { title: 'Analysis Panel/National Deviation Histogram' };

const Template = args => (
  <Provider store={mockStore({})}>
    <AnalysisPanelProvider {...args}>
      <NationalDeviationHistogram {...args} />
    </AnalysisPanelProvider>
  </Provider>
);

export const NoClickedFeatures = Template.bind({});
NoClickedFeatures.args = {
  selectedProperty,
  ...props,
};

export const OneClickedFeature = Template.bind({});

const oneFeature = [
  {
    object: {
      properties: {
        'People in the age band 0-17': 1000,
      },
    },
  },
];

OneClickedFeature.args = {
  ...NoClickedFeatures.args,
  clickedFeatures: oneFeature,
};

export const MultipleClickedFeaturesSum = Template.bind({});

const multipleFeatures = [
  {
    object: {
      properties: {
        'People in the age band 0-17': 1000,
      },
    },
  },
  {
    object: {
      properties: {
        'People in the age band 0-17': 500,
      },
    },
  },
  {
    object: {
      properties: {
        'People in the age band 0-17': 250,
      },
    },
  },
];

MultipleClickedFeaturesSum.args = {
  ...NoClickedFeatures.args,
  clickedFeatures: multipleFeatures,
};

export const MultipleClickedFeaturesAverage = Template.bind({});
MultipleClickedFeaturesAverage.args = {
  ...MultipleClickedFeaturesSum.args,
  selectedProperty: {
    ...selectedProperty,
    aggregation: 'mean',
  },
};

export const NoAggregates = Template.bind({});
NoAggregates.args = {
  ...OneClickedFeature.args,
  selectedProperty: omit(selectedProperty, 'aggregates'),
};
