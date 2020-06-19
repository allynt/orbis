import React from 'react';

import CorporateAccount from './corporate-account.component';

export default { title: 'Admin/CorporateAccount', component: CorporateAccount };

const title = 'Corporate Account';
const user = {
  name: 'John Smith',
  email: 'johnnybigdick@gmail.com',
  phone: '12345678910',
  customers: [
    {
      name: 'cyberdyne',
      type: 'manager',
    },
  ],
};
const customer = {
  type: 'MULTIPLE',
  name: 'cyberdyne',
  title: 'Cyberdyne Systems',
  logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
  users: [
    {
      id: 2,
      customers: [
        {
          name: 'cyberdyne',
          manager: true,
        },
      ],
      username: 'admin@test.com',
      email: 'admin@test.com',
      name: 'Harry Callahan',
      avatar:
        'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
      description: '',
      is_verified: true,
      is_approved: true,
      profiles: {},
      roles: ['AdminRole', 'UserRole'],
    },
  ],
  data_limit: 100,
  data_total: 50,
};

export const Default = () => <CorporateAccount title={title} user={user} customer={customer} />;
