import * as React from 'react';

import faker from '@faker-js/faker/locale/en_GB';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  makeCustomer,
  makeUsers,
} from 'mission-control/views/users-view/test-story-data';

import UsersView from './users-view.component';

const mockStore = createMockStore([thunk]);

export default {
  title: 'Mission Control/Users',
};

const users = [
  ...makeUsers('ACTIVE', faker.random.number(20)),
  ...makeUsers('PENDING', faker.random.number(20)),
];
const customer = makeCustomer(users);

const Template = ({ users }) => (
  <Provider
    store={mockStore({
      accounts: { user: {} },
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
  users,
};
