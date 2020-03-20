import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, fireEvent, within } from '@testing-library/react';

import UserList from './user-list.component';

const mockStore = configureMockStore([thunk]);

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
        users={users}
        fetchUsers={fetchUsers}
        createUser={createUser}
        deleteUser={deleteUser}
        updateUser={updateUser}
        copyUser={copyUser}
      />
    );

    expect(getByText('Maintain Users')).toBeInTheDocument();
    expect(getByText('Actions')).toBeInTheDocument();
    expect(getByText('Key')).toBeInTheDocument();
    expect(getByText('Username')).toBeInTheDocument();
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('First Name')).toBeInTheDocument();
    expect(getByText('Last Name')).toBeInTheDocument();
  });

  it('should render a populated list of users', () => {
    users = [
      {
        pk: 1,
        username: 'user 1',
        email: 'user1@test.com',
        first_name: 'John',
        last_name: 'Smith'
      },
      {
        pk: 2,
        username: 'user 2',
        email: 'user2@test.com',
        first_name: 'Jane',
        last_name: 'Doe'
      }
    ];

    const { getByText } = render(
      <UserList
        users={users}
        fetchUsers={fetchUsers}
        createUser={createUser}
        deleteUser={deleteUser}
        updateUser={updateUser}
        copyUser={copyUser}
      />
    );

    expect(getByText('Maintain Users')).toBeInTheDocument();
    expect(getByText('user1@test.com')).toBeInTheDocument();
    expect(getByText('user2@test.com')).toBeInTheDocument();
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
      </Provider>
    );

    fireEvent.click(getByText('New User'));
    const userDetailForm = container.querySelector('.user-detail-form-container');

    expect(within(userDetailForm).getByText('Create New User')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Username:')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Email Address:')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Password:')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Password (Confirm):')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Reset')).toBeInTheDocument();
    expect(within(userDetailForm).getByText('Create User')).toBeInTheDocument();
  });
});
