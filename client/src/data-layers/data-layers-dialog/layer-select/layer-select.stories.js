import * as React from 'react';
import { LayerSelect } from './layer-select.component';

export default {
  title: 'Data Layers/DataLayersDialog/LayerSelect',
  argTypes: {
    onSourceChange: { action: 'onSourceChange' },
    onSourcesChange: { action: 'onSourcesChange' },
    onSubmit: { action: 'onSubmit' },
  },
};

const SOURCES = [
  {
    source_id: 'oil/source/1',
    name: 'Oil',
    metadata: {
      name: 'Oil',
      label: 'Oil Source 1',
      application: {
        orbis: {
          categories: {
            name: 'Oil Parent 1',
            child: { name: 'Oil Child 1' },
          },
          orbs: [{ name: 'Oil and Gas', description: 'test' }],
        },
      },
    },
  },
  {
    source_id: 'oil/source/2',
    name: 'Oil',
    metadata: {
      name: 'Oil',
      label: 'Oil Source 2',
      application: {
        orbis: {
          categories: {
            name: 'Oil Parent 1',
            child: { name: 'Oil Child 1' },
          },
          orbs: [{ name: 'Oil and Gas', description: 'test' }],
        },
      },
    },
  },
  {
    source_id: 'gas/source/1',
    name: 'Gas',
    metadata: {
      name: 'Gas',
      label: 'Gas Source 1',
      application: {
        orbis: {
          categories: {
            name: 'Gas Parent 1',
            child: { name: 'Gas Child 1' },
          },
          orbs: [{ name: 'Oil and Gas', description: 'test' }],
        },
      },
    },
  },
  {
    source_id: 'gas/source/2',
    name: 'Gas',
    metadata: {
      name: 'Gas',
      label: 'Gas Source 2',
      application: {
        orbis: {
          categories: {
            name: 'Gas Parent 1',
            child: { name: 'Gas Child 1' },
          },
          orbs: [{ name: 'Oil and Gas', description: 'test' }],
        },
      },
    },
  },
];

const Template = args => (
  <LayerSelect selectedOrbName="Oil and Gas" {...args} />
);

export const NoSources = Template.bind({});

export const Categories = Template.bind({});
Categories.args = {
  sources: SOURCES,
  selectedSources: ['oil/source/1', 'oil/source/2'],
};

export const SubCategories = Template.bind({});
SubCategories.args = {
  sources: SOURCES,
};

export const AMix = Template.bind({});
AMix.args = {
  sources: [
    {
      source_id: 'oil/source/1',
      metadata: {
        label: 'Oil Source 1',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
    {
      source_id: 'oil/source/2',
      metadata: {
        label: 'Oil Source 2',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
    {
      source_id: 'gas/source/1',
      metadata: {
        label: 'Gas Source 1',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
  ],
};

export const NoCategories = Template.bind({});
NoCategories.args = {
  sources: [
    {
      source_id: 'oil/source/1',
      metadata: {
        label: 'Oil Source 1',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
    {
      source_id: 'oil/source/2',
      metadata: {
        label: 'Oil Source 2',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
    {
      source_id: 'gas/source/1',
      metadata: {
        label: 'Gas Source 1',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
    {
      source_id: 'gas/source/2',
      metadata: {
        label: 'Gas Source 2',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
  ],
};

export const MultiNesting = Template.bind({});
MultiNesting.args = {
  sources: [
    {
      source_id: 'gas/source/2',
      name: 'Gas',
      metadata: {
        name: 'Gas',
        label: 'Found me!',
        application: {
          orbis: {
            categories: {
              name: 'Gas Parent 1',
              child: {
                name: 'Gas Parent 2',
                child: {
                  name: 'Gas Parent 3',
                  child: { name: 'Gas Parent 4' },
                },
              },
            },
            orbs: [{ name: 'Oil and Gas', description: 'test' }],
          },
        },
      },
    },
  ],
};

export const SomeSelected = Template.bind({});
SomeSelected.args = {
  selectedSources: ['oil/source/1', 'gas/source/2'],
  sources: [
    {
      source_id: 'oil/source/1',
      metadata: {
        label: 'Oil Source 1',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
    {
      source_id: 'oil/source/2',
      metadata: {
        label: 'Oil Source 2',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
    {
      source_id: 'gas/source/1',
      metadata: {
        label: 'Gas Source 1',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
    {
      source_id: 'gas/source/2',
      metadata: {
        label: 'Gas Source 2',
        application: {
          orbis: { orbs: [{ name: 'Oil and Gas', description: 'test' }] },
        },
      },
    },
  ],
};
