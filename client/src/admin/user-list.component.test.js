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
  let customer = null;
  let createCustomerUser = null;
  let deleteCustomerUser = null;
  let updateCustomerUser = null;
  let copyCustomerUser = null;

  beforeEach(() => {
    users = [];
    customer = {};
    createCustomerUser = jest.fn();
    deleteCustomerUser = jest.fn();
    updateCustomerUser = jest.fn();
    copyCustomerUser = jest.fn();

    fetch.resetMocks();
  });

  afterEach(cleanup);

  it('should render an empty list of users', () => {
    const { getByText } = render(
      <UserList
        users={null}
        customer={null}
        createCustomerUser={createCustomerUser}
        deleteCustomerUser={deleteCustomerUser}
        updateCustomerUser={updateCustomerUser}
        copyCustomerUser={copyCustomerUser}
      />,
    );

    expect(getByText('Maintain Users')).toBeInTheDocument();
    expect(getByText('Use actions within table to update user(s)')).toBeInTheDocument();
  });

  it('should render the `New User` form when `New User` button clicked', () => {
    store = mockStore({});
    const { container, getByText } = render(
      <Provider store={store}>
        <UserList
          users={users}
          customer={customer}
          createCustomerUser={createCustomerUser}
          deleteCustomerUser={deleteCustomerUser}
          updateCustomerUser={updateCustomerUser}
          copyCustomerUser={copyCustomerUser}
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
