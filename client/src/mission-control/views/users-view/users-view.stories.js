import * as React from 'react';

import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  activeUsers,
  customer,
  pendingUsers,
} from 'mission-control/test-story-data';

import UsersView from './users-view.component';

const mockStore = createMockStore([thunk]);

export default {
  title: 'Mission Control/Users View',
};

const Template = ({ users }) => (
  <Provider
    store={mockStore({
      missionControl: {
        customerUsers: users,
        currentCustomer: customer,
      },
    })}
  >
    <UsersView />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {
  users: [],
};

export const LotsOfUsers = Template.bind({});
LotsOfUsers.args = {
  users: [
    ...activeUsers,
    ...activeUsers,
    ...activeUsers,
    ...activeUsers,
    ...pendingUsers,
    ...pendingUsers,
    ...pendingUsers,
    ...pendingUsers,
  ],
};
