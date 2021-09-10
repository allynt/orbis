import React from 'react';

import userEvent from '@testing-library/user-event';
import { push } from 'connected-react-router';

import { render } from 'test/test-utils';

import { MissionControl } from './mission-control.component';
import {
  fetchCustomerRequested,
  fetchCustomerUsersRequested,
} from './mission-control.slice';

const testCustomer = {
  id: '0',
  name: 'test-customer',
  title: 'Test Customer',
  licences: [{ id: '1', orb: 'Rice' }],
};

const defaultState = {
  missionControl: {
    currentCustomer: testCustomer,
  },
};

describe('MissionControl', () => {
  it('Is visible if location contains mission-control', () => {
    const { getByRole } = render(<MissionControl />, {
      state: defaultState,
      history: { initialEntries: ['/mission-control'] },
    });
    expect(getByRole('heading', { name: /hello/i })).toBeInTheDocument();
  });

  it('Is not visible if location does not contain mission-control', () => {
    const { queryByRole } = render(<MissionControl />, {
      state: defaultState,
      history: { initialEntries: ['/totally-not'] },
    });
    expect(queryByRole('heading', { name: /hello/i })).not.toBeInTheDocument();
  });

  it('Navigates to map and closes if the backdrop is clicked', () => {
    const { getByRole, store } = render(<MissionControl />, {
      state: defaultState,
      history: { initialEntries: ['/mission-control'] },
    });
    userEvent.click(getByRole('none'));
    expect(store.getActions()).toContainEqual(push('/map'));
  });

  it('Redirects to the default route if the user tries to navigate to an admin only route', () => {
    const { history } = render(<MissionControl />, {
      state: defaultState,
      history: { initialEntries: ['/mission-control/store'] },
    });
    expect(history.location.pathname).toBe('/mission-control/support');
  });

  it('fetches customer if no customer, when component is loaded', () => {
    fetch.once(JSON.stringify({}));
    const { store } = render(<MissionControl />, {
      state: {
        accounts: { user: { customers: [{}] } },
        missionControl: { currentCustomer: null },
      },
    });

    const expectedActions = [
      { type: fetchCustomerRequested.type, payload: undefined },
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('fetches customerUsers if customer but no customerUsers, when component is loaded', () => {
    fetch.once(JSON.stringify({}));
    const { store } = render(<MissionControl />, {
      state: {
        accounts: { user: { customers: [{ type: 'MANAGER' }] } },
        missionControl: { currentCustomer: testCustomer, customerUsers: null },
      },
      history: { initialEntries: ['/mission-control'] },
    });

    const expectedActions = [
      {
        type: fetchCustomerUsersRequested.type,
        payload: undefined,
      },
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });
});
