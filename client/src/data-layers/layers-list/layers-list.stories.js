import React from 'react';
import { LayersList } from './layers-list.component';

export default { title: 'Data Layers/LayersList' };

export const NoLayers = () => <LayersList />;

export const SelectedLayers = () => (
  <LayersList
    selectedLayers={[
      {
        metadata: { label: 'Test Layer 1' },
        name: 'test-layer-1',
        source_id: 'test/test/test-layer-1',
      },
      {
        metadata: { label: 'Test Layer 2' },
        name: 'test-layer-2',
        source_id: 'test/test/test-layer-2',
      },
    ]}
  />
);
