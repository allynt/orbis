import React from 'react';

import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import AccountDetails from './account-details.component';

export default { title: 'Mission Control/Account Details' };

const mockStore = createMockStore([thunk]);

const Template = args => (
  <Provider
    store={mockStore({
      accounts: {
        user: { name: 'John Smith', email: 'john.smith@test.com' },
      },
      missionControl: {
        currentCustomer: { name: 'Test Org', id: 'test-id-123' },
      },
    })}
  >
    <AccountDetails {...args} />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};
