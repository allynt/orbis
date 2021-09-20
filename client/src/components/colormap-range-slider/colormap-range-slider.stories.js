import React from 'react';

import { ColormapRangeSlider } from './colormap-range-slider.component';

const COLOR_MAPS = [
  'OrRd',
  'PuBu',
  'BuPu',
  'Oranges',
  'BuGn',
  'YlOrBr',
  'YlGn',
  'Reds',
  'RdPu',
  'Greens',
  'YlGnBu',
  'Purples',
  'GnBu',
  'Greys',
  'YlOrRd',
  'PuRd',
  'Blues',
  'PuBuGn',
  'Spectral',
  'RdYlGn',
  'RdBu',
  'PiYG',
  'PRGn',
  'RdYlBu',
  'BrBG',
  'RdGy',
  'PuOr',
  'Set2',
  'Accent',
  'Set1',
  'Set3',
  'Dark2',
  'Paired',
  'Pastel2',
  'Pastel1',
];

export default {
  title: 'Components/ColormapRangeSlider',
  component: ColormapRangeSlider,
  argTypes: {
    colorMap: {
      control: {
        type: 'select',
        options: COLOR_MAPS,
      },
      defaultValue: 'Spectral',
    },
  },
};

const Template = args => {
  const [value, setValue] = React.useState([args.min ?? 1, args.max ?? 10]);
  return (
    <div style={{ padding: '2rem' }}>
      <ColormapRangeSlider onChange={setValue} value={value} {...args} />
    </div>
  );
};

export const Percentage = Template.bind({});
Percentage.args = {
  type: 'continuous',
  units: '%',
  min: 0,
  max: 100,
};

export const Decile = Template.bind({});
Decile.args = {
  snap: true,
  type: 'decile',
};

export const Continuous = Template.bind({});
Continuous.args = { type: 'continuous', min: 300, max: 1000 };

export const NegativeDomain = Template.bind({});
NegativeDomain.args = { type: 'continuous', min: -100, max: 100 };

export const SmallDomain = Template.bind({});
SmallDomain.args = { min: 0.1, max: 0.9, precision: 2 };

export const Reversed = Template.bind({});
Reversed.args = {
  ...Continuous.args,
  reversed: true,
};

export const ReversedDecile = Template.bind({});
ReversedDecile.args = {
  ...Decile.args,
  reversed: true,
};

export const Clipped = Template.bind({});
Clipped.args = {
  min: 0,
  max: 100,
  clipMin: 20,
  clipMax: 70,
};

export const LongValues = Template.bind({});
LongValues.args = {
  min: -1000000,
  max: 1000000,
};

export const BarOnly = Template.bind({});
BarOnly.args = {
  ...Percentage.args,
  barOnly: true,
};
