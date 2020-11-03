import * as React from 'react';
import LayerSelectItem from './layer-select-item.component';

export default {
  title: 'Data Layers/DataLayersDialog/LayerSelect/LayerSelectItem',
  argTypes: { onChange: { action: 'onChange' } },
};

export const Default = () => (
  <LayerSelectItem
    source={{
      source_id: 'test/source/123',
      // @ts-ignore
      metadata: {
        description: 'This is the description',
        label: 'Test Source',
      },
    }}
  />
);
