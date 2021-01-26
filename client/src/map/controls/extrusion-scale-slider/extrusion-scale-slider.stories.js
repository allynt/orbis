import * as React from 'react';
import { ExtrusionScaleSlider } from './extrusion-scale-slider.component';

export default {
  title: 'Map/Controls/Extrusion Scale Slider',
  argTypes: { onChange: { action: 'onChange' } },
};

export const Default = args => <ExtrusionScaleSlider {...args} />;

export const Controlled = () => {
  const [value, setValue] = React.useState(10);
  return <ExtrusionScaleSlider value={value} onChange={setValue} />;
};
