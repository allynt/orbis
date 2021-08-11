import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { push } from 'connected-react-router';
import fetchMock from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { placeOrder } from 'accounts/accounts.slice';
import { fetchOrbs } from 'data-layers/data-layers.slice';

import { Store } from './store.component';

const orbs = new Array(5).fill().map((_, i) => ({ id: i, name: `Orb ${i}` }));

const mockStore = createMockStore([thunk]);

const renderComponent = ({
  state = { data: { orbs } },
  pathname = '',
} = {}) => {
  const path = '/mission-control/store';
  const store = mockStore(state);
  // @ts-ignore
  const utils = render(
    <Store
      // @ts-ignore
      match={{ path }}
      // @ts-ignore
      location={{ key: '123', pathname: `${path}${pathname}` }}
    />,
    {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <MemoryRouter>{children}</MemoryRouter>
        </Provider>
      ),
    },
  );
  return { ...utils, store };
};

describe('<Store />', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("Fetches orbs if there aren't any", () => {
    const { store } = renderComponent({ state: { data: { orbs: undefined } } });
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({ type: fetchOrbs.pending.type }),
    );
  });

  it('Shows the Orbs view by default', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('heading', { name: 'Orbis Store' })).toBeInTheDocument();
  });

  it('Shows the orb details page for the orb id in location', () => {
    const { getByRole } = renderComponent({ pathname: '/1' });
    expect(getByRole('heading', { name: orbs[1].name })).toBeVisible();
  });

  it('Shows the checkout view', () => {
    const { getByRole } = renderComponent({
      pathname: '/checkout/?orbId=1&users=10',
    });
    expect(getByRole('heading', { name: 'Your Order' })).toBeInTheDocument();
  });

  it('Shows the completion view', () => {
    const { getByRole, getByText } = renderComponent({
      pathname: '/completion/?orbId=1&users=10',
    });
    expect(getByRole('heading', { name: 'Your Order' })).toBeInTheDocument();
    expect(getByText(/godspeed/i)).toBeInTheDocument();
  });

  it('Places an order when the checkout confirm button is clicked and navigates to completion on success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { getByRole, store } = renderComponent({
      pathname: '/checkout/?orbId=1&users=10',
    });

    userEvent.click(getByRole('checkbox'));
    userEvent.click(getByRole('button'));
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
