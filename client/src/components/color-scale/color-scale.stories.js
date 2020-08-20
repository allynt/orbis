import React from 'react';
import ColorScale from './color-scale.component';

export default { title: 'Components/ColorScale' };

export const Continuous = () => (
  <>
    <ColorScale />
    <ColorScale scheme="Blues" domain={[50, 100]} />
  </>
);

export const Percentage = () => (
  <>
    <ColorScale type="percentage" />
    <ColorScale type="percentage" scheme="Spectral" domain={[0, 1.77]} />
  </>
);

export const Decile = () => (
  <>
    <ColorScale type="decile" />
    <ColorScale type="decile" scheme="YlOrRd" />
  </>
);
