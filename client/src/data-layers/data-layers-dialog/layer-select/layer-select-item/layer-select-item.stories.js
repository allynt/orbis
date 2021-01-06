import { List } from '@astrosat/astrosat-ui';
import * as React from 'react';
import LayerSelectItem from './layer-select-item.component';

export default {
  title: 'Data Layers/DataLayersDialog/LayerSelect/LayerSelectItem',
  argTypes: { onChange: { action: 'onChange' } },
};

const Template = args => (
  <List>
    <LayerSelectItem {...args} />
  </List>
);

export const Default = Template.bind({});
Default.args = {
  source: {
    source_id: 'test/source/123',
    // @ts-ignore
    metadata: {
      description: 'This is the description',
      label: 'Test Source',
    },
  },
};

export const NoDescription = Template.bind({});
NoDescription.args = {
  source: {
    source_id: 'test/source/123',
    // @ts-ignore
    metadata: {
      label: 'Test Source',
    },
  },
};
