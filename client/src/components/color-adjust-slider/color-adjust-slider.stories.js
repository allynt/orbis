import React, { useState } from 'react';

import { ColorAdjustSlider } from './color-adjust-slider.component';

export default { title: 'Components/Color Adjust Slider' };

export const Default = args => {
  const [clip, setClip] = useState([args.max * 0.2, args.max * 0.8]);
  return (
    <div
      style={{
        padding: '2rem',
      }}
    >
      <ColorAdjustSlider
        {...args}
        clipMin={clip[0]}
        clipMax={clip[1]}
        onChange={setClip}
      />
    </div>
  );
};
Default.args = {
  min: 0,
  max: 100,
  colorMap: 'Viridis',
  reversed: false,
};
