import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { LayerVisibilityCheckbox } from './layer-visibility-checkbox.component';

const mockStore = configureMockStore();

const Index = {
  title: 'Sidebar Components/Layer Visibility Checkbox',
  argTypes: {
    dispatch: { action: 'dispatch' },
  },
};

export default Index;

const Template = ({ state, ...args }) => (
  <Provider store={mockStore(state)}>
    <LayerVisibilityCheckbox {...args} />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {
  selectedLayer: {
    metadata: {
      label: 'Test Layer',
    },
  },
};

export const Color = Template.bind({});
Color.args = {
  ...Default.args,
  color: '#a851c1',
};

export const Icon = Template.bind({});
Icon.args = {
  ...Default.args,
  icon: 'PicnicSite',
};

export const Both = Template.bind({});
Both.args = {
  ...Color.args,
  ...Icon.args,
};

export const Info = Template.bind({});
Info.args = {
  ...Both.args,
  info: 'This is some test info',
};
