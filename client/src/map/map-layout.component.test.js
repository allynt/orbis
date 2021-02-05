import React from 'react';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import MapLayout from './map-layout.component';
import { Provider } from 'react-redux';
import { MapProvider } from 'MapContext';

jest.mock('@deck.gl/react');

const mockStore = configureMockStore([thunk]);

const setup = initialState =>
  render(<MapLayout />, {
    wrapper: ({ children }) => (
      <Provider
        store={mockStore({
          ...initialState,
          pollingPeriod: 30000,
          sources: null,
        })}
      >
        <MapProvider>{children}</MapProvider>
      </Provider>
    ),
  });

describe('<MapLayout />', () => {
  beforeEach(() => fetch.mockResponse(JSON.stringify({})));

  it('shows the toolbar if a user is present', () => {
    const { getByTitle } = setup({
      accounts: { user: { userKey: 'test' } },
      app: { apiUrl: 'http://test.com' },
    });

    expect(getByTitle('Orbis Logo')).toBeInTheDocument();
  });
});
