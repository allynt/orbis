import React from 'react';
import { LayersList } from './layers-list.component';

export default { title: 'Data Layers/LayersList' };

const Template = args => <LayersList {...args} />;

export const NoLayers = Template.bind({});

export const SelectedLayers = Template.bind({});
SelectedLayers.args = {
  selectedLayers: [
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
  ],
};

export const WithCategories = Template.bind({});
WithCategories.args = {
  selectedLayers: [
    {
      category: 'Forestry',
      sources: [
        { source_id: 'forestry/1', metadata: { label: 'Trees 1' } },
        { source_id: 'forestry/2', metadata: { label: 'Trees 2' } },
      ],
    },
    {
      category: 'Health',
      sources: [{ source_id: 'health/1', metadata: { label: 'Hospitals' } }],
    },
  ],
  sidebarComponents: {
    'forestry/1': <>Forestry 1</>,
    'forestry/2': <>Forestry 2</>,
    'health/1': <>Hospitals</>,
  },
};
