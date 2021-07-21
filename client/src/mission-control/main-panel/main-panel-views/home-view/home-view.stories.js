// import * as React from 'react';

// import { activeUsers, customer, pendingUsers } from '../test-story-data';
// import HomeView from './home-view.component';

// export default {
//   title: 'Admin/Home View',
//   argTypes: {
//     onChangeRoleClick: { action: 'onChangeRoleClick' },
//     onEditUserClick: { action: 'onEditUserClick' },
//     onResendInvitationClick: { action: 'onResendInvitationClick' },
//     onWithdrawInvitationClick: { action: 'onWithdrawInvitationClick' },
//     onDeleteUserClick: { action: 'onDeleteUserClick' },
//   },
// };

// const Template = args => <HomeView {...args} />;

// export const Default = Template.bind({});

// export const WithUsers = Template.bind({});
// /** @type {import('./home-view.component').HomeViewProps} */
// WithUsers.args = {
//   activeUsers,
//   pendingUsers,
//   customer,
//   quickViewData: {
//     active: activeUsers.length,
//     pending: pendingUsers.length,
//     available: customer.licences.filter(l => !l.customer_user).length,
//   },
//   currentUser: activeUsers[0].user,
// };

// export const LotsOfUsers = Template.bind({});
// LotsOfUsers.args = {
//   ...WithUsers.args,
//   activeUsers: [...activeUsers, ...activeUsers, ...activeUsers, ...activeUsers],
// };

// export const LotsOfBoth = Template.bind({});
// LotsOfBoth.args = {
//   ...LotsOfUsers.args,
//   pendingUsers: [
//     ...pendingUsers,
//     ...pendingUsers,
//     ...pendingUsers,
//     ...pendingUsers,
//     ...pendingUsers,
//   ],
// };
