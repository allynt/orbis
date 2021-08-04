import React from 'react';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MissionControl } from './mission-control.component';

const mockStore = createMockStore([thunk]);

export default { title: 'Mission Control' };

const Template = args => (
  <Provider store={mockStore()}>
    <MemoryRouter initialEntries={['/mission-control/users']}>
      <MissionControl {...args} />
    </MemoryRouter>
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};
