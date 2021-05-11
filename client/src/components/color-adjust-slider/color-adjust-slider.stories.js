import React, { useState } from 'react';
import { ColorAdjustSlider } from './color-adjust-slider.component';

export default { title: 'Components/Color Adjust Slider' };

export const Default = () => {
  const [clip, setClip] = useState([20, 80]);
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
        min={0}
        max={100}
        clipMin={clip[0]}
        clipMax={clip[1]}
        color="Viridis"
        onSliderChange={setClip}
      />
    </div>
  );
};
