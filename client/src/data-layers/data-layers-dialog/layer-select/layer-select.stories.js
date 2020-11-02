import * as React from 'react';
import { LayerSelect } from './layer-select.component';

export default { title: 'Data Layers/DataLayersDialog/LayerSelect' };

const Template = args => <LayerSelect {...args} />;

export const NoLayers = Template.bind({});

export const Layers = Template.bind({});
Layers.args = {
  domain: { layers: [{ metadata: { label: 'Layer 1' } }] },
};
