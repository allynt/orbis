import React from 'react';
import { select } from '@storybook/addon-knobs';
import InfoBox from './info-box.component';

export default { title: 'Components/InfoBox' };

export const Arrow = () => (
  <InfoBox arrow={select('Arrow', ['top', 'right', 'bottom', 'left'], 'left')}>
    <h1 style={{ fontSize: '2.5rem' }}>InfoBox</h1>
    <p>With an arrow</p>
  </InfoBox>
);

export const Customised = () => (
  <InfoBox
    arrow="left"
    style={{ fontSize: '2rem', color: 'hotpink', top: '5rem' }}
  >
    <h1 style={{ fontSize: '2.5rem' }}>InfoBox</h1>
    <p>That's customised</p>
  </InfoBox>
);
