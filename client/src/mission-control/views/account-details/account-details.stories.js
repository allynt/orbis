import React from 'react';

import { AccountDetails } from './account-details.component';

export default { title: 'Mission Control/Account Details' };

const Template = args => <AccountDetails {...args} />;

export const Default = Template.bind({});
Default.args = {};
