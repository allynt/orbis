import React from 'react';

import { Box, Grid } from '@astrosat/astrosat-ui';

import faker from '@faker-js/faker/locale/en_GB';

import { SelectedPropertyControls } from './selected-property-controls.component';

const Index = {
  title: 'Orbs/Isolation Plus/Property Radio Group/Selected Property Controls',
  argTypes: {
    onDateChange: { action: true },
    onRangeFilterChange: { action: true },
    onClipRangeChange: { action: true },
  },
};

export default Index;

const Template = args => (
  <Box p={2} width="100%">
    <Grid container spacing={2}>
      <SelectedPropertyControls {...args} />
    </Grid>
  </Box>
);

export const BasicProperty = Template.bind({});
BasicProperty.args = {
  selectedProperty: {
    min: 0,
    max: 100,
    clip_min: 20,
    clip_max: 80,
    application: { orbis: { display: { color: 'Viridis' } } },
  },
};

export const TimeseriesProperty = Template.bind({});
TimeseriesProperty.args = {
  selectedProperty: {
    ...BasicProperty.args.selectedProperty,
    timeseries: true,
    timeseries_latest_timestamp: new Date(2077, 9, 23).toISOString(),
    timeseries_timestamps: Array(31)
      .fill()
      .map((_, i) => new Date(2077, 9, i).toISOString()),
  },
};

export const DiscreteProperty = Template.bind({});
DiscreteProperty.args = {
  selectedProperty: {
    ...TimeseriesProperty.args.selectedProperty,
    type: 'discrete',
    categories: Array(10)
      .fill()
      .map(() => [
        faker.commerce.productName(),
        {
          color: `#${faker.random.hexaDecimal(6).replace('0x', '')}`,
          description: faker.commerce.productDescription(),
        },
      ])
      .reduce((acc, [category, obj]) => ({ ...acc, [category]: obj }), {}),
  },
};
