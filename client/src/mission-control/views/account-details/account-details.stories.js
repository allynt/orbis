import React from 'react';

import { AccountDetailsComponent } from './account-details.component';

export default { title: 'Mission Control/Account Details' };

const Template = args => <AccountDetailsComponent {...args} />;

export const Default = Template.bind({});
Default.args = {};
