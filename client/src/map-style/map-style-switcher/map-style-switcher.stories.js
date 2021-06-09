import React, { useState } from 'react';

import { styles } from '../styles';
import MapStyleSwitcher from './map-style-switcher.component';

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
