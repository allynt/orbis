import React, { useState } from 'react';
import { ColorAdjustSlider } from './color-adjust-slider.component';

export default { title: 'Components/Color Adjust Slider' };

export const Default = args => {
  const [clip, setClip] = useState([args.max * 0.2, args.max * 0.8]);
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
      }}
    >
      <ColorAdjustSlider
        {...args}
        clipMin={clip[0]}
        clipMax={clip[1]}
        onSliderChange={setClip}
      />
    </div>
  );
};
Default.args = {
  min: 0,
  max: 100,
  color: 'Viridis',
  reversed: false,
};
