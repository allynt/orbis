import * as React from 'react';

import DataLayersDialog from './data-layers-dialog.component';

export default {
  title: 'Data Layers/DataLayersDialog',
  args: { open: true },
  argTypes: { close: { action: 'close' }, onSubmit: { action: 'onSubmit' } },
};

const Template = args => <DataLayersDialog {...args} />;

export const Empty = Template.bind({});

export const Orbs = Template.bind({});
Orbs.args = {
  orbs: [
    {
      name: 'Forestry',
      sources: [
        {
          category: 'Animals',
          sources: [
            {
              source_id: 'forestry/source/2',
              metadata: { label: 'Bears', description: 'Lions and tigers' },
            },
            { source_id: 'forestry/source/3', metadata: { label: 'Deer' } },
          ],
        },
        {
          category: 'Trees',
          sources: [
            {
              category: 'Evergreen',
              sources: [
                { source_id: 'forestry/source/1', metadata: { label: 'Pine' } },
              ],
            },
            {
              category: 'Deciduous',
              sources: [
                {
                  source_id: 'forestry/source/4',
                  metadata: { label: 'Birch' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Healthcare',
      sources: [
        {
          category: 'Hospitals',
          sources: [
            { source_id: 'healthcare/source/2', metadata: { label: 'Bears' } },
            { source_id: 'healthcare/source/3', metadata: { label: 'Staff' } },
          ],
        },
        { source_id: 'healthcare/source/1', metadata: { label: 'PPE' } },
      ],
    },
  ],
};

export const LotsOfOrbs = Template.bind({});
LotsOfOrbs.args = {
  orbs: new Array(50).fill(undefined).map((_, i) => ({ name: `Orb ${i}` })),
};

export const LotsOfSources = Template.bind({});
LotsOfSources.args = {
  orbs: [
    {
      name: 'Oh my',
      sources: new Array(50).fill(undefined).map((_, i) => ({
        source_id: `orb/source/${i}`,
        metadata: { label: `Layer ${i}` },
      })),
    },
  ],
};

export const LotsOfBoth = Template.bind({});
LotsOfBoth.args = {
  orbs: new Array(50).fill(undefined).map((_, orbIndex) => ({
    name: `Orb ${orbIndex}`,
    sources: new Array(50).fill(undefined).map((_, layerIndex) => ({
      source_id: `orb/${orbIndex}/source/${layerIndex}`,
      metadata: {
        label: `Orb ${orbIndex} Layer ${layerIndex}`,
        description: `Orb ${orbIndex} Layer ${layerIndex} description`,
      },
    })),
  })),
};
