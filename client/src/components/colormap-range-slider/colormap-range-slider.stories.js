import * as React from 'react';
import ColorMapRangeSlider from './colormap-range-slider.component';

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
  title: 'Components/ColorMapRangeSlider',
  argTypes: {
    onChange: { action: 'onChange', disable: true },
    color: {
      control: {
        type: 'select',
        options: COLOR_MAPS,
      },
      defaultValue: 'Spectral',
    },
  },
};

const Template = args => <ColorMapRangeSlider {...args} />;

export const Percentage = Template.bind({});
Percentage.args = {
  type: 'continuous',
  units: '%',
  domain: [0, 100],
};

export const Decile = Template.bind({});
Decile.args = {
  snap: true,
  type: 'decile',
};

export const Continuous = Template.bind({});
Continuous.args = { type: 'continuous', domain: [300, 1000] };

export const NegativeDomain = Template.bind({});
NegativeDomain.args = { type: 'continuous', domain: [-100, 100] };

export const Controlled = () => {
  const [value, setValue] = React.useState(undefined);

  const handleChange = domain => setValue(domain);

  return (
    <>
      <ColorMapRangeSlider
        type="continuous"
        onChange={handleChange}
        color="Spectral"
        value={value}
      />
      <button onClick={() => setValue([0, 1])}>Reset value</button>
      <pre>{JSON.stringify(value)}</pre>
    </>
  );
};
