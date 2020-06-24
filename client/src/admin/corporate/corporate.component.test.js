import React from 'react';

import { cleanup, render } from '@testing-library/react';

import CorporateAccount from './corporate-account.component';
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
    const { container, getByText, getByAltText } = render(<CorporateAccount title={title} customer={customer} />);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByAltText('Organisation Logo')).toBeInTheDocument();
    // expect(getByText('Name:')).toBeInTheDocument();
    // expect(getByText('VAT Registered:')).toBeInTheDocument();
    // expect(getByText('Full Name:')).toBeInTheDocument();
    // expect(getByText('Storage Info')).toBeInTheDocument();
    // expect(getByText('Payment Account ID:')).toBeInTheDocument();
    expect(getByText('Update Changes')).toBeInTheDocument();
  });

  it('should render the Administrator Form', () => {
    const { container, getByText, getByAltText } = render(<AdministratorProfile title={title} user={user} />);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByAltText('Admin Avatar')).toBeInTheDocument();
    expect(getByText('Name:')).toBeInTheDocument();
    expect(getByText('Role:')).toBeInTheDocument();
    expect(getByText('Update Changes')).toBeInTheDocument();
  });

  xit('should disable `Update Changes` buttons until changes have been made', () => {
    const { getByText } = render(<CorporateAccount title={title} user={user} customer={customer} />);

    expect(getByText('Update Account')).not.toHaveAttribute('disabled');
  });

  xit('should save changes when `Update Changes` buttons is clicked', () => {
    const { getByText } = render(<CorporateAccount title={title} user={user} customer={customer} />);

    expect(getByText('Update Account')).not.toHaveAttribute('disabled');
  });

  xit('should switch view to `User Table` when `Assign New  Admin` button is clicked', () => {
    const { getByText } = render(<CorporateAccount title={title} user={user} customer={customer} />);

    expect(getByText('Update Account')).not.toHaveAttribute('disabled');
  });

  xit('should open dialog when `Assign New  Admin` button is clicked', () => {
    const { getByText } = render(<CorporateAccount title={title} user={user} customer={customer} />);

    expect(getByText('Update Account')).not.toHaveAttribute('disabled');
  });
});
