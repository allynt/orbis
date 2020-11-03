import * as React from 'react';
import { LayerSelect } from './layer-select.component';

export default {
  title: 'Data Layers/DataLayersDialog/LayerSelect',
  argTypes: {
    onSourceChange: { action: 'onSourceChange' },
    onAcceptClick: { action: 'onAcceptClick' },
  },
};

const Template = args => <LayerSelect {...args} />;

export const NoSources = Template.bind({});

export const Categories = Template.bind({});
Categories.args = {
  orbSources: [
    {
      category: 'Oil',
      sources: [
        { source_id: 'oil/source/1', metadata: { label: 'Oil Source 1' } },
        { source_id: 'oil/source/2', metadata: { label: 'Oil Source 2' } },
      ],
    },
    {
      category: 'Gas',
      sources: [
        { source_id: 'gas/source/1', metadata: { label: 'Gas Source 1' } },
        { source_id: 'gas/source/2', metadata: { label: 'Gas Source 2' } },
      ],
    },
  ],
};

export const SubCategories = Template.bind({});
SubCategories.args = {
  orbSources: [
    {
      category: 'Oil & Gas',
      sources: [
        {
          category: 'Oil',
          sources: [
            { source_id: 'oil/source/1', metadata: { label: 'Oil Source 1' } },
            { source_id: 'oil/source/2', metadata: { label: 'Oil Source 2' } },
          ],
        },
        {
          category: 'Gas',
          sources: [
            { source_id: 'gas/source/1', metadata: { label: 'Gas Source 1' } },
            { source_id: 'gas/source/2', metadata: { label: 'Gas Source 2' } },
          ],
        },
      ],
    },
  ],
};

export const AMix = Template.bind({});
AMix.args = {
  orbSources: [
    {
      category: 'Oil & Gas',
      sources: [
        {
          category: 'Oil',
          sources: [
            { source_id: 'oil/source/1', metadata: { label: 'Oil Source 1' } },
            { source_id: 'oil/source/2', metadata: { label: 'Oil Source 2' } },
          ],
        },
        { source_id: 'gas/source/1', metadata: { label: 'Gas Source 1' } },
      ],
    },
  ],
};

export const NoCategories = Template.bind({});
NoCategories.args = {
  orbSources: [
    { source_id: 'oil/source/1', metadata: { label: 'Oil Source 1' } },
    { source_id: 'oil/source/2', metadata: { label: 'Oil Source 2' } },
    { source_id: 'gas/source/1', metadata: { label: 'Gas Source 1' } },
    { source_id: 'gas/source/2', metadata: { label: 'Gas Source 2' } },
  ],
};

export const MultiNesting = Template.bind({});
MultiNesting.args = {
  orbSources: [
    {
      category: 'Level 1',
      sources: [
        {
          category: 'Level 2',
          sources: [
            {
              category: 'Level 3',
              sources: [
                {
                  category: 'Level 4',
                  sources: [
                    {
                      source_id: 'cheeky/hidden/source/1',
                      metadata: {
                        label: 'You Found Me!',
                        description: 'Test Description',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const SomeSelected = Template.bind({});
SomeSelected.args = {
  selectedSources: ['oil/source/1', 'gas/source/2'],
  orbSources: [
    {
      category: 'Oil',
      sources: [
        { source_id: 'oil/source/1', metadata: { label: 'Oil Source 1' } },
        { source_id: 'oil/source/2', metadata: { label: 'Oil Source 2' } },
      ],
    },
    {
      category: 'Gas',
      sources: [
        { source_id: 'gas/source/1', metadata: { label: 'Gas Source 1' } },
        { source_id: 'gas/source/2', metadata: { label: 'Gas Source 2' } },
      ],
    },
  ],
};
