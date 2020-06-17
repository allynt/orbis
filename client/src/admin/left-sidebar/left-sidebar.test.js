import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import LeftSidebar from './left-sidebar.component';

import { USER_TABLE, ACTIVITY_LOG } from '../admin.component';

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
      data_limit: 100,
      data_total: 50,
    };
  });

  it('should render the admin console side menu', () => {
    const { getByText } = render(
      <Router history={history}>
        <LeftSidebar user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );
    expect(getByText('Launch Orbis')).toBeInTheDocument();
  });

  it('should return to user table view when Orbis logo is clicked', () => {
    const { getByTestId } = render(
      <Router history={history}>
        <LeftSidebar user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByTestId('orbis logo'));
    expect(setVisiblePanel).toHaveBeenCalledWith(USER_TABLE);
  });

  it('should open Orbis in a new tab when "Launch Orbis" link clicked', () => {
    const { getByText } = render(
      <Router history={history}>
        <LeftSidebar user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByText('Launch Orbis'));
    expect(history.location.pathname).toEqual('/');
  });

  it('should switch main panel views when side-menu buttons are clicked', () => {
    const { getByText } = render(
      <Router history={history}>
        <LeftSidebar user={user} selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByText('Activity Log'));
    expect(setVisiblePanel).toHaveBeenCalledWith(ACTIVITY_LOG);
    fireEvent.click(getByText('Home'));
    expect(setVisiblePanel).toHaveBeenCalledWith(USER_TABLE);
  });
});
