import React from 'react';

export const useMySupplyLynkOrb = ({ data, activeSources }) => {
  console.log('Data: ', data);
  console.log('Active Sources: ', activeSources);

  let layers = 'Layers';
  let mapComponents = 'Map Components';
  let sidebarComponents = 'Sidebar Components';

  return { layers, mapComponents, sidebarComponents };
};
