import React from 'react';

import { rest } from 'msw';
import { Route, Routes } from 'react-router-dom';

import { server } from 'mocks/server';
import {
  render,
  userEvent,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from 'test/test-utils';

import { MissionControl } from './mission-control.component';
import {
  fetchCustomer,
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
  accounts: {
    user: {
      name: 'Test User',
      customers: [
        {
          type: 'USER',
        },
      ],
    },
  },
  missionControl: {
    currentCustomer: testCustomer,
  },
};

describe('MissionControl', () => {
  it('Is visible if location contains mission-control', () => {
    render(
      <Routes>
        <Route path="/mission-control/*" element={<MissionControl />} />
      </Routes>,
      {
        state: defaultState,
        history: { initialEntries: ['/mission-control'] },
      },
    );
    expect(screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument();
  });

  it('Is not visible if location does not contain mission-control', () => {
    render(
      <Routes>
        <Route path="/mission-control/*" element={<MissionControl />} />
        <Route path="/totally-not" element={<div />} />
      </Routes>,
      {
        state: defaultState,
        history: { initialEntries: ['/totally-not'] },
      },
    );
    expect(
      screen.queryByRole('heading', { name: /hello/i }),
    ).not.toBeInTheDocument();
  });

  it('Navigates to the background location and closes if the backdrop is clicked', async () => {
    const { store } = render(
      <Routes>
        <Route path="/mission-control/*" element={<MissionControl />} />
      </Routes>,
      {
        state: {
          ...defaultState,
        },
        history: { initialEntries: ['/mission-control'] },
      },
    );
    userEvent.click(screen.getByRole('none'));
    await waitForElementToBeRemoved(screen.getByRole('dialog'));
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({ type: 'app/setBackgroundLocation' }),
    );
  });

  it('Redirects to the default route if the user tries to navigate to an admin only route', async () => {
    const { history } = render(
      <Routes>
        <Route path="/mission-control/*" element={<MissionControl />} />
      </Routes>,
      {
        state: defaultState,
        history: { initialEntries: ['/mission-control/store'] },
      },
    );
    await waitFor(() =>
      expect(history.location.pathname).toBe('/mission-control/support'),
    );
  });
  it('fetches customerUsers if customer but no customerUsers, when component is loaded', () => {
    server.use(
      rest.get('*/api/customers/:customerId/users/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );
    const { store } = render(
      <Routes>
        <Route path="/mission-control/*" element={<MissionControl />} />
        <Route path="/" element={<div />} />
      </Routes>,
      {
        state: {
          accounts: { user: { customers: [{ type: 'MANAGER' }] } },
          missionControl: {
            currentCustomer: testCustomer,
            customerUsers: null,
          },
        },
        history: { initialEntries: ['/mission-control'] },
      },
    );

    const expectedActions = expect.arrayContaining([
      expect.objectContaining({
        type: fetchCustomerUsersRequested.type,
        payload: undefined,
      }),
    ]);
    expect(store.getActions()).toEqual(expectedActions);
  });

  xit('fetches customer if no customer, when component is loaded', () => {
    // TODO: investigate why this test is failing
    server.use(
      rest.get('*/api/customers/:customerId', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    const { store } = render(
      <Routes>
        <Route path="/mission-control/*" element={<MissionControl />} />
        <Route path="/" element={<div />} />
      </Routes>,
      {
        state: {
          accounts: { user: { customers: [{ type: 'MANAGER' }] } },
          missionControl: {
            currentCustomer: testCustomer,
            customerUsers: [],
          },
        },
      },
    );

    const expectedActions = expect.arrayContaining([
      expect.objectContaining({
        type: 'missionControl/fetchCustomerRequested',
      }),
    ]);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
