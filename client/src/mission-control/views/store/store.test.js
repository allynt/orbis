import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { fetchOrbs } from 'data-layers/data-layers.slice';

import { Store } from './store.component';

const orbs = new Array(5).fill().map((_, i) => ({ id: i, name: `Orb ${i}` }));

const mockStore = createMockStore([thunk]);

const renderComponent = ({
  state = { data: { orbs } },
  pathname = '',
} = {}) => {
  const path = '/store';
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
});
