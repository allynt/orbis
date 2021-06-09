import * as React from 'react';

import { AnalysisPanelProvider } from 'analysis-panel/analysis-panel-context';

import { PropertyBreakdownChart } from './property-breakdown-chart.component';

export default { title: 'Analysis Panel/Property Breakdown Chart' };

const selectedProperty = {
  source_id: 'test/layer',
  aggregation: 'sum',
  breakdown: [
    'people aged 0-17',
    'people aged 18-39',
    'people aged 40-64',
    'people aged 65+',
  ],
};

const Template = args => {
  return (
    <AnalysisPanelProvider
      currentSource={{
        source_id: 'test/layer',
        metadata: {
          properties: [
            { name: 'people aged 0-17' },
            { name: 'people aged 18-39' },
            { name: 'people aged 40-64' },
            { name: 'people aged 65+' },
          ],
        },
      }}
      {...args}
    >
      <PropertyBreakdownChart {...args} />
    </AnalysisPanelProvider>
  );
};

export const NoClickedFeatures = Template.bind({});
NoClickedFeatures.args = {
  selectedProperty,
};

export const OneClickedFeature = Template.bind({});
OneClickedFeature.args = {
  ...NoClickedFeatures.args,
  clickedFeatures: [
    {
      object: {
        properties: {
          'people aged 0-17': 1,
          'people aged 18-39': 2,
          'people aged 40-64': 3,
          'people aged 65+': 4,
        },
      },
    },
  ],
};

export const MultipleClickedFeatures = Template.bind({});
MultipleClickedFeatures.args = {
  ...NoClickedFeatures.args,
  clickedFeatures: [
    ...OneClickedFeature.args.clickedFeatures,
    {
      object: {
        properties: {
          'people aged 0-17': 5,
          'people aged 18-39': 6,
          'people aged 40-64': 7,
          'people aged 65+': 8,
        },
      },
    },
    {
      object: {
        properties: {
          'people aged 0-17': 1,
          'people aged 18-39': 2,
          'people aged 40-64': 7,
          'people aged 65+': 8,
        },
      },
    },
  ],
};
