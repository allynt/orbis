import React from 'react';

import { cleanup, render } from '@testing-library/react';

import AdministratorProfile from './administrator-profile.component';

describe('Update User Form Component', () => {
  let title = 'Corporate Account';
  let user = {
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

  afterEach(cleanup);

  it('should render the Administrator Form', () => {
    const { container, getByText, getByAltText } = render(<AdministratorProfile title={title} user={user} />);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByAltText('Admin Avatar')).toBeInTheDocument();
    expect(getByText('Name:')).toBeInTheDocument();
    expect(getByText('Role:')).toBeInTheDocument();
    expect(getByText('Update Changes')).toBeInTheDocument();
  });
});
