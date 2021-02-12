import * as React from 'react';
import { Provider } from 'react-redux';
import { LayerVisibilityCheckbox } from './layer-visibility-checkbox.component';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

export default {
  title: 'Sidebar Components/Layer Visibility Checkbox',
  argTypes: {
    dispatch: { action: 'dispatch' },
  },
};

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
