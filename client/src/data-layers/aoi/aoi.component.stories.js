import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { SidePanel } from 'components/side-panel/side-panel.component';

import Aoi from './aoi.component';

const mockStore = configureMockStore();

export default {
  title: 'Data Layers/AOI/Sidebar',
  argTypes: { onDrawAoiClick: { action: 'onDrawAoiClick' } },
};

const Template = ({ state, ...args }) => (
  <Provider store={mockStore(state)}>
    <Aoi {...args} />
  </Provider>
);

export const Default = Template.bind({});

export const InSidebar = ({ state, ...args }) => (
  <Provider store={mockStore(state)}>
    <SidePanel open={true}>
      <Aoi {...args} />
    </SidePanel>
  </Provider>
);
