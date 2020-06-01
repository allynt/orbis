import React from 'react';

import { cleanup, render, fireEvent } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import AdminSideMenu from './admin-side-menu.component';

import { HOME, ACTIVITY_LOG } from './admin.component';

describe('Admin Component', () => {
  let history = null;
  let user = null;
  let setVisiblePanel = null;

  afterEach(cleanup);

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });
    user = { name: 'John Smith' };
    setVisiblePanel = jest.fn();
  });

  it('should render the admin console side menu', () => {
    const { getByText, getByAltText } = render(
      <Router history={history}>
        <AdminSideMenu user={user} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    expect(getByText('Administrator')).toBeInTheDocument();
    expect(getByText(user.name)).toBeInTheDocument();
    expect(getByAltText('User Profile')).toBeInTheDocument();
    expect(getByText('Launch Orbis')).toBeInTheDocument();
  });

  it('should open Orbis in a new tab when "Launch Orbis" link clicked', () => {
    const { getByText } = render(
      <Router history={history}>
        <AdminSideMenu user={user} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByText('Launch Orbis'));
    expect(history.location.pathname).toEqual('/');
  });

  it('should switch main panel views when side-menu buttons are clicked', () => {
    const { getByText } = render(
      <Router history={history}>
        <AdminSideMenu user={user} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByText('Activity Log'));
    expect(setVisiblePanel).toHaveBeenCalledWith(ACTIVITY_LOG);
    fireEvent.click(getByText('Home'));
    expect(setVisiblePanel).toHaveBeenCalledWith(HOME);
  });
});
