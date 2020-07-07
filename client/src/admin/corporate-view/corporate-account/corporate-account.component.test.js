import React from 'react';

import { cleanup, render } from '@testing-library/react';

import CorporateAccount from './corporate-account.component';

describe('Update User Form Component', () => {
  let title = 'Corporate Account';
  let customer = {
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

  afterEach(cleanup);

  it('should render the Corporate Account Form', () => {
    const { container, getByAltText } = render(
      <CorporateAccount title={title} customer={customer} />,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByAltText('Organisation Logo')).toBeInTheDocument();
  });
});
