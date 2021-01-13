import { isEqual } from 'lodash';
import * as React from 'react';
import { ColorMapRangeSlider } from './colormap-range-slider.component';

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
    onChange: { action: 'onChange' },
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

export const SmallDomain = Template.bind({});
SmallDomain.args = { domain: [0.1, 0.9] };

export const Reversed = Template.bind({});
Reversed.args = {
  reversed: true,
};

export const ReversedDecile = Template.bind({});
ReversedDecile.args = {
  reversed: true,
  type: 'decile',
};

export const Controlled = () => {
  const domain1 = [0, 10],
    domain2 = [100, 1000];
  const [domain, setDomain] = React.useState(domain1);
  const [value, setValue] = React.useState(undefined);

  const handleChange = domain => setValue(domain);

  const handleClick = () => {
    const newDomain = isEqual(domain, domain1) ? domain2 : domain1;
    setDomain(newDomain);
    setValue(undefined);
  };

  return (
    <>
      <ColorMapRangeSlider
        type="continuous"
        onChange={handleChange}
        color="Spectral"
        precision={1}
        value={value}
        domain={domain}
      />
      <button onClick={handleClick}>Switch Domain</button>
      <pre>{JSON.stringify(value)}</pre>
    </>
  );
};

export const Clipped = Template.bind({});
Clipped.args = {
  domain: [0, 100],
  clip: [20, 70],
};
