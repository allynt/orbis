import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, fireEvent, within } from '@testing-library/react';

import UserList from './user-list.component';

const mockStore = configureMockStore([thunk]);

jest.mock('./user-table.component', () => () => <div />);

describe('User List Component', () => {
  let store = null;
  let users = null;
  let fetchUsers = null;
  let createUser = null;
  let deleteUser = null;
  let updateUser = null;
  let copyUser = null;

  beforeEach(() => {
    users = [];
    fetchUsers = jest.fn();
    createUser = jest.fn();
    deleteUser = jest.fn();
    updateUser = jest.fn();
    copyUser = jest.fn();

    fetch.resetMocks();
  });

  afterEach(cleanup);

  it('should render an empty list of users', () => {
    const { getByText } = render(
      <UserList
        users={null}
        fetchUsers={fetchUsers}
        createUser={createUser}
        deleteUser={deleteUser}
        updateUser={updateUser}
        copyUser={copyUser}
      />,
    );

    expect(getByText('Maintain Users')).toBeInTheDocument();
    expect(getByText('Use actions within table to update user(s)')).toBeInTheDocument();
    expect(fetchUsers).toHaveBeenCalled();
  });

  it('should render the `New User` form when `New User` button clicked', () => {
    store = mockStore({});
    const { container, getByText } = render(
      <Provider store={store}>
        <UserList
          users={users}
          fetchUsers={fetchUsers}
          createUser={createUser}
          deleteUser={deleteUser}
          updateUser={updateUser}
          copyUser={copyUser}
        />
      </Provider>,
    );

    fireEvent.click(getByText('New User'));
    const userDetailForm = container.querySelector('.user-detail-form-container');

    expect(within(userDetailForm).getByText('Create New User')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Email Address:')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Password:')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Password (Confirm):')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Reset')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Create User')).toBeInTheDocument();
  });
});
