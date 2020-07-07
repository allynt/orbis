import React from 'react';

import { cleanup, render } from '@testing-library/react';

import AdministratorProfile from './administrator-profile.component';

describe('Update User Form Component', () => {
  let title = 'Corporate Account';
  let user = {
    name: 'John Smith',
    email: 'jsmith@gmail.com',
    phone: '12345678910',
    avatar:
      'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
    customers: [
      {
        name: 'cyberdyne',
        type: 'manager',
      },
    ],
  };

  afterEach(cleanup);

  it('should render the Administrator Form', () => {
    const { container, getByText, getByAltText } = render(
      <AdministratorProfile title={title} user={user} />,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByAltText('Admin Avatar')).toBeInTheDocument();
    expect(getByText('Name:')).toBeInTheDocument();
  });
});
