import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import MapLayout from './map-layout.component';
import { Provider } from 'react-redux';

jest.mock('@deck.gl/react');

const mockStore = configureStore();

describe('<MapLayout />', () => {
  it("does not show the toolbar if there's no user", () => {
    const { queryByTitle } = render(
      <Provider store={mockStore()}>
        <MapLayout />
      </Provider>,
    );

    expect(queryByTitle('Orbis Logo')).not.toBeInTheDocument();
  });

  it('shows the toolbar if a user is present', () => {
    const { getByTitle } = render(
      <Provider store={mockStore({ accounts: { user: {} } })}>
        <MapLayout />
      </Provider>,
    );

    expect(getByTitle('Orbis Logo')).toBeInTheDocument();
  });
});
