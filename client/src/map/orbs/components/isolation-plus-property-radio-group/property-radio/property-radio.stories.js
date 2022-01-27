import React from 'react';

import PropertyRadio from './property-radio.component';

const Index = {
  title: 'Orbs/Isolation Plus/Property Radio Group/Property Radio',
  args: {
    layerSourceId: 'test/layer',
    categoryPath: 'Fake > Category > Path',
  },
  argTypes: {
    onPropertyChange: { action: true },
    onDateChange: { action: true },
    onSliderChange: { action: true },
  },
};

export default Index;

const Template = args => <PropertyRadio {...args} />;

export const NonGroupProperty = Template.bind({});
const property = {
  name: 'property 1',
  label: 'Test Property',
  description: 'This is a test description',
  min: 10,
  max: 100,
  application: { orbis: { display: { color: 'viridis' } } },
};
NonGroupProperty.args = {
  properties: [property],
  selectedProperty: {
    ...property,
    source_id: 'test/layer',
  },
};

export const LongLabel = Template.bind({});
LongLabel.args = {
  ...NonGroupProperty.args,
  properties: [
    {
      ...property,
      label: 'This is really really long wow, I mean like super long',
    },
  ],
};

export const Timeseries = Template.bind({});
const timeseriesProperty = {
  ...property,
  timeseries: true,
  timeseries_default_timestamp: new Date(2001, 0, 0).toISOString(),
  timeseries_timestamps: new Array(10)
    .fill(undefined)
    .map((_, i) => new Date(i + 2001, 0, 0).toISOString()),
};
Timeseries.args = {
  properties: [timeseriesProperty],
  selectedProperty: {
    ...timeseriesProperty,
    source_id: 'test/layer',
  },
  selectedTimestamp: new Date(2001, 0, 0).getTime(),
};

export const Group = Template.bind({});
const properties = [
  {
    name: 'Property 1',
    type: 'percentage',
    label: 'Test Property Group',
    description: 'Fake description',
  },
  timeseriesProperty,
  { name: 'Property 3', type: 'decile' },
];
Group.args = {
  ...Timeseries.args,
  properties,
};
