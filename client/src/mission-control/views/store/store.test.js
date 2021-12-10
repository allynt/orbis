import React from 'react';

import fetchMock from 'jest-fetch-mock';
import { push } from 'redux-first-history';

import { placeOrder } from 'accounts/accounts.slice';
import { fetchOrbs } from 'data-layers/data-layers.slice';
import { render, waitFor, screen, userEvent } from 'test/test-utils';

import { Store } from './store.component';

const orbs = new Array(5).fill().map((_, i) => ({ id: i, name: `Orb ${i}` }));

fetchMock.enableMocks();

const setup = ({ state = { data: { orbs } }, pathname = '' } = {}) => {
  const path = '/mission-control/store';
  return render(
    <Store
      match={{ path }}
      location={{ key: '123', pathname: `${path}${pathname}` }}
    />,
    { state },
  );
};

describe('<Store />', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("Fetches orbs if there aren't any", () => {
    const { store } = setup({ state: { data: { orbs: undefined } } });

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({ type: fetchOrbs.pending.type }),
    );
  });

  it('Shows the Orbs view by default', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Orbs' })).toBeInTheDocument();
  });

  it('Shows the orb details page for the orb id in location', () => {
    setup({ pathname: '/1' });

    expect(screen.getByRole('heading', { name: orbs[1].name })).toBeVisible();
  });

  it('Shows the checkout view', () => {
    setup({
      pathname: '/checkout/?orbId=1&users=10',
    });

    expect(
      screen.getByRole('heading', { name: 'Your Order' }),
    ).toBeInTheDocument();
  });

  it('Shows the completion view', () => {
    setup({
      pathname: '/completion/?orbId=1&users=10',
    });

    expect(
      screen.getByRole('heading', { name: 'Your Order' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/godspeed/i)).toBeInTheDocument();
  });

  it('Places an order when the checkout confirm button is clicked and navigates to completion on success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { store } = setup({
      pathname: '/checkout/?orbId=1&users=10',
    });

    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByRole('button'));
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({ type: placeOrder.pending.type }),
    );
    await waitFor(() =>
      expect(store.getActions()).toContainEqual(
        push(expect.stringContaining('completion')),
      ),
    );
  });
});
