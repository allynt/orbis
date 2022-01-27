import React from 'react';

import faker from '@faker-js/faker/locale/en_GB';

import { Info } from './info.component';

export default { title: 'Mission Control/Account Details/Info' };

const Template = args => <Info {...args} />;

export const Default = Template.bind({});
Default.args = {
  userName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  organisationName: faker.company.companyName(),
  organisationId: faker.random.uuid(),
};
