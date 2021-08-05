import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { push } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MissionControl } from './mission-control.component';

const mockStore = configureMockStore([thunk]);

const setup = (location = '/mission-control') => {
  const history = createMemoryHistory({
    initialEntries: [location],
  });
  const store = mockStore({
    accounts: { userKey: '123abc', user: { customers: [{ type: 'MEMBER' }] } },
    missionControl: {
      currentCustomer: {
        id: '0',
        name: 'test-customer',
        title: 'Test Customer',
        licences: [{ id: '1', orb: 'Rice' }],
      },
      customerUsers: [],
    },
  });

  const utils = render(
    <Router history={history}>
      <Provider store={store}>
        <MissionControl />
      </Provider>
    </Router>,
  );
  return { ...utils, history, store };
};

describe('MissionControl', () => {
  it('Is visible if location contains mission-control', () => {
    const { getByRole } = setup();
    expect(getByRole('heading', { name: /hello/i })).toBeInTheDocument();
  });

  it('Is not visible if location does not contain mission-control', () => {
    const { queryByRole } = setup('/totally-not');
    expect(queryByRole('heading', { name: /hello/i })).not.toBeInTheDocument();
  });

  it('switches panels', async () => {
    const { getByRole, queryByRole, getByText } = setup(
      '/mission-control/users',
    );
    expect(getByRole('button', { name: 'Create User' })).toBeInTheDocument();

    userEvent.click(getByText('Other'));

    await waitFor(() =>
      expect(
        queryByRole('button', { name: 'Create User' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('Navigates to map and closes if the backdrop is clicked', () => {
    const { getByRole, store } = setup();
    userEvent.click(getByRole('none'));
    expect(store.getActions()).toContainEqual(push('/map'));
  });

  it('Redirects to the default route if the user tries to navigate to an admin only route', () => {
    const { history } = setup('/mission-control/store');
    expect(history.location.pathname).toBe('/mission-control/users');
  });
});
