import React, { useState } from 'react';
import MapStyleSwitcher from './map-style-switcher.component';
import { styles } from '../styles';

export default {
  title: 'Map/Map Style Switcher',
  args: {
    mapStyles: styles,
    open: true,
  },
};

export const NoneSelected = args => <MapStyleSwitcher {...args} />;

export const Selected = args => {
  const [selectedStyle, setSelectedStyle] = useState('satellite');
  return (
    <MapStyleSwitcher
      {...args}
      selectedMapStyle={selectedStyle}
      selectMapStyle={setSelectedStyle}
    />
  );
};
