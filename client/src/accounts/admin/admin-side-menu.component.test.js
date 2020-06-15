import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import AdminSideMenu from './admin-side-menu.component';

import { USER_TABLE, ACTIVITY_LOG } from './admin.component';

describe('Admin Side Menu Component', () => {
  let history = null;
  let user = null;
  let setVisiblePanel = null;
  let selectedCustomer = null;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });
    user = { name: 'John Smith', avatar: 'test-url' };
    setVisiblePanel = jest.fn();
    selectedCustomer = {
      type: 'MULTIPLE',
      name: 'cyberdyne',
      title: 'Cyberdyne Systems',
      description: 'Bringing you the future, today.',
      logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
      users: [
        {
          id: 1,
          username: 'user@test.com',
          email: 'user@test.com',
          name: null,
          description: '',
          is_verified: true,
          is_approved: true,
          profiles: {},
          roles: ['UserRole', 'AstrosatRole'],
        },
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
        {
          id: 2,
          username: 'verified@test.com',
          email: 'verified@test.com',
          password: 'pandaconcretespoon',
          name: null,
          description: '',
          is_verified: true,
          is_approved: false,
          profiles: {},
          roles: ['UserRole'],
        },
        {
          id: 3,
          username: 'approved@test.com',
          email: 'approved@test.com',
          password: 'pandaconcretespoon',
          name: null,
          description: '',
          is_verified: false,
          is_approved: true,
          profiles: {},
          roles: ['UserRole'],
        },
      ],
      roles: ['SaveTheWorldRole'],
      permissions: ['can_deploy_skynet'],
      data_limit: 100,
      data_total: 50,
    };
  });

  it('should render the admin console side menu', () => {
    const { getByText, getByAltText } = render(
      <Router history={history}>
        <AdminSideMenu user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    expect(getByText('Administrator')).toBeInTheDocument();
    expect(getByText(user.name)).toBeInTheDocument();
    expect(getByAltText('User Profile')).toBeInTheDocument();
    expect(getByText('Launch Orbis')).toBeInTheDocument();
    expect(getByText('Storage')).toBeInTheDocument();
  });

  it('should render the default profile if user has no avatar', () => {
    user.avatar = null;
    const { getByTestId } = render(
      <Router history={history}>
        <AdminSideMenu user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    expect(getByTestId('default-icon')).toBeInTheDocument();
  });

  it('should return to user table view when Orbis logo is clicked', () => {
    const { getByTestId } = render(
      <Router history={history}>
        <AdminSideMenu user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByTestId('orbis logo'));
    expect(setVisiblePanel).toHaveBeenCalledWith(USER_TABLE);
  });

  it('should open Orbis in a new tab when "Launch Orbis" link clicked', () => {
    const { getByText } = render(
      <Router history={history}>
        <AdminSideMenu user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByText('Launch Orbis'));
    expect(history.location.pathname).toEqual('/');
  });

  it('should switch main panel views when side-menu buttons are clicked', () => {
    const { getByText } = render(
      <Router history={history}>
        <AdminSideMenu user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByText('Activity Log'));
    expect(setVisiblePanel).toHaveBeenCalledWith(ACTIVITY_LOG);
    fireEvent.click(getByText('Home'));
    expect(setVisiblePanel).toHaveBeenCalledWith(USER_TABLE);
  });
});
