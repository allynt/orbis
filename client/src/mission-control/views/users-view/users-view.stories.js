import * as React from 'react';

import {
  activeUsers,
  customer,
  pendingUsers,
} from 'mission-control/test-story-data';

import UsersView from './users-view.component';

export default {
  title: 'Mission Control/Users View',
  argTypes: {},
};

const Template = args => <UsersView {...args} />;

export const Default = Template.bind({});

export const WithUsers = Template.bind({});
WithUsers.args = {
  activeUsers,
  pendingUsers,
  customer,
  quickViewData: {
    active: activeUsers.length,
    pending: pendingUsers.length,
    available: customer.licences.filter(l => !l.customer_user).length,
  },
  currentUser: activeUsers[0].user,
};

export const LotsOfUsers = Template.bind({});
LotsOfUsers.args = {
  ...WithUsers.args,
  activeUsers: [...activeUsers, ...activeUsers, ...activeUsers, ...activeUsers],
};

export const LotsOfBoth = Template.bind({});
LotsOfBoth.args = {
  ...LotsOfUsers.args,
  pendingUsers: [
    ...pendingUsers,
    ...pendingUsers,
    ...pendingUsers,
    ...pendingUsers,
    ...pendingUsers,
  ],
};
