import React from 'react';

import { rest } from 'msw';
import { Route, Routes } from 'react-router-dom';

import { placeOrder } from 'accounts/accounts.slice';
import { fetchOrbs } from 'data-layers/data-layers.slice';
import { server } from 'mocks/server';
import { render, waitFor, screen, userEvent } from 'test/test-utils';

import { Store } from './store.component';

const orbs = new Array(5).fill().map((_, i) => ({ id: i, name: `Orb ${i}` }));

const setup = ({ state = { data: { orbs } }, pathname = '/store' } = {}) => {
  return render(
    <Routes>
      <Route path="/store/*" element={<Store />} />
      <Route
        path="/mission-control/store/completion/:orbId/:users"
        element={<div>Complete</div>}
      />
    </Routes>,
    {
      state,
      history: { initialEntries: [pathname] },
    },
  );
};

describe('<Store />', () => {
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
    setup({ pathname: '/store/1' });

    expect(screen.getByRole('heading', { name: orbs[1].name })).toBeVisible();
  });

  it('Shows the checkout view', () => {
    setup({
      pathname: '/store/checkout/1/10',
    });

    expect(
      screen.getByRole('heading', { name: 'Your Order' }),
    ).toBeInTheDocument();
  });

  it('Shows the completion view', () => {
    setup({
      pathname: '/store/completion/1/10',
    });

    expect(
      screen.getByRole('heading', { name: 'Your Order' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/godspeed/i)).toBeInTheDocument();
  });

  it('Places an order when the checkout confirm button is clicked and navigates to completion on success', async () => {
    server.use(
      rest.get('*/orbs/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
      rest.get('*/data/sources/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
      rest.get('*/customers/:customerId', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
      rest.post('*/customers/:customerId/orders/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    const { store, history } = setup({
      pathname: '/store/checkout/1/10',
    });

    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByRole('button'));
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({ type: placeOrder.pending.type }),
    );

    await waitFor(() =>
      expect(history.location.pathname).toContain('completion'),
    );
  });
});
