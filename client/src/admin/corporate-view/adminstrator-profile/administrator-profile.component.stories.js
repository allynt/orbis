import React from 'react';

import AdministratorProfile from './administrator-profile.component';

export default { title: 'Administrator Profile', component: AdministratorProfile };

const user = {
  name: 'John Smith',
  email: 'jsmith@gmail.com',
  phone: '12345678910',
  customers: [
    {
      name: 'cyberdyne',
      type: 'manager',
    },
  ],
};

export const Default = () => <AdministratorProfile user={user} />;
