import React from 'react';

import AdministratorProfile from './administrator-profile.component';

export default {
  title: 'Admin/Administrator Profile',
  component: AdministratorProfile,
};

const user = {
  name: 'John Smith',
  email: 'jsmith@gmail.com',
  phone: '12345678910',
  avatar:
    'https://pbs.twimg.com/profile_images/1218555839826579458/GL8pjTKD_400x400.jpg',
  customers: [
    {
      name: 'cyberdyne',
      type: 'manager',
    },
  ],
};

export const Default = () => <AdministratorProfile user={user} />;
