import React from 'react';
import { LayersListItem } from './layers-list-item.component';

export default { title: 'DataLayers/LayersList/LayersListItem' };

export const NoChildren = () => <LayersListItem title="Test Layer" />;

export const WithChildren = () => (
  <LayersListItem title="Test Layer">
    <div>Child component</div>
  </LayersListItem>
);
