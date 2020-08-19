import React from 'react';
import ColorScale from './color-scale.component';

export default { title: 'Components/ColorScale' };

export const Continuous = () => (
  <>
    <ColorScale />
    <ColorScale scheme="Blues" domain={[50, 100]} />
  </>
);
