import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { push } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MissionControlComponent } from './mission-control.component';
import {
  fetchCustomerRequested,
  fetchCustomerUsersRequested,
} from './mission-control.slice';

const mockStore = configureMockStore([thunk]);

const testCustomer = {
  id: '0',
  name: 'test-customer',
  title: 'Test Customer',
  licences: [{ id: '1', orb: 'Rice' }],
};

const setup = ({
  location = '/mission-control',
  currentCustomer = testCustomer,
  customerUsers = [],
  userIsAdmin = true,
}) => {
  const history = createMemoryHistory({
    initialEntries: [location],
  });
  const store = mockStore({
    accounts: {
      userKey: '123abc',
      user: { customers: [{ type: userIsAdmin ? 'MANAGER' : 'MEMBER' }] },
    },
    missionControl: {
      currentCustomer,
      customerUsers,
    },
  });

  const utils = render(
    <Router history={history}>
      <Provider store={store}>
        <MissionControlComponent />
      </Provider>
    </Router>,
  );
  return { ...utils, history, store };
};

describe('MissionControl', () => {
  it('Is visible if location contains mission-control', () => {
    const { getByRole } = setup({});
    expect(getByRole('heading', { name: /hello/i })).toBeInTheDocument();
  });

  it('Is not visible if location does not contain mission-control', () => {
    const { queryByRole } = setup({ location: '/totally-not' });
    expect(queryByRole('heading', { name: /hello/i })).not.toBeInTheDocument();
  });

  it('switches panels when sidepanel links are clicked', async () => {
    const { getByRole, queryByRole } = setup({
      location: '/mission-control/users',
    });
    expect(getByRole('button', { name: 'Create User' })).toBeInTheDocument();

    userEvent.click(getByRole('link', { name: /Support/i }));

    await waitFor(() =>
      expect(
        queryByRole('button', { name: 'Create User' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('Navigates to map and closes if the backdrop is clicked', () => {
    const { getByRole, store } = setup({});
    userEvent.click(getByRole('none'));
    expect(store.getActions()).toContainEqual(push('/map'));
  });

  it('Redirects to the default route if the user tries to navigate to an admin only route', () => {
    const { history } = setup({
      location: '/mission-control/store',
      userIsAdmin: false,
    });
    expect(history.location.pathname).toBe('/mission-control/support');
  });

  it('fetches customer if no customer, when component is loaded', () => {
    fetch.once(JSON.stringify({}));
    const { store } = setup({ currentCustomer: null });

    const expectedActions = [
      { type: fetchCustomerRequested.type, payload: undefined },
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('fetches customerUsers if customer but no customerUsers, when component is loaded', () => {
    fetch.once(JSON.stringify({}));
    const { store } = setup({ customerUsers: null });

    const expectedActions = [
      {
        type: fetchCustomerUsersRequested.type,
        payload: undefined,
      },
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });
});
