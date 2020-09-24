import React, { useState } from 'react';
import MapStyleSwitcher from './map-style-switcher.component';
import { styles } from '../styles';

export default { title: 'Map/Map Style Switcher' };

export const NoneSelected = () => <MapStyleSwitcher mapStyles={styles} />;

export const Selected = () => {
  const [selectedStyle, setSelectedStyle] = useState('satellite');
  return (
    <MapStyleSwitcher
      mapStyles={styles}
      selectedMapStyle={selectedStyle}
      selectMapStyle={setSelectedStyle}
    />
  );
};
