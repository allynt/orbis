import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import MapLayout from './map-layout.component';
import { Provider } from 'react-redux';
import { MapProvider } from 'MapContext';

jest.mock('@deck.gl/react');

const mockStore = configureStore();

const setup = initialState =>
  render(<MapLayout />, {
    wrapper: ({ children }) => (
      <Provider store={mockStore(initialState)}>
        <MapProvider>{children}</MapProvider>
      </Provider>
    ),
  });

describe('<MapLayout />', () => {
  beforeEach(() => fetch.mockResponse(JSON.stringify({})));

  it("does not show the toolbar if there's no user", () => {
    const { queryByTitle } = setup();

    expect(queryByTitle('Orbis Logo')).not.toBeInTheDocument();
  });

  it('shows the toolbar if a user is present', () => {
    const { getByTitle } = setup({ accounts: { user: {} } });

    expect(getByTitle('Orbis Logo')).toBeInTheDocument();
  });
});
