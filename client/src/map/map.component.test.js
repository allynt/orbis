import * as React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { MapProvider } from 'MapContext';
import { SatellitesProvider } from 'satellites/satellites-context';

import Map from './map.component';

jest.mock('@deck.gl/react');

const mockStore = configureStore();

const setup = initialState => {
  const store = mockStore(initialState);
  const utils = render(<Map />, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <SatellitesProvider>
          <MapProvider>{children}</MapProvider>
        </SatellitesProvider>
      </Provider>
    ),
  });
  return { ...utils, store };
};

describe('<Map />', () => {
  beforeEach(() => fetch.mockResponse(JSON.stringify({})));

  it('displays the load mask when bookmarks is loading', () => {
    const { getByTestId } = setup({
      app: { config: { mapbox_token: '123' } },
      bookmarks: { isLoading: true },
    });
    expect(getByTestId('load-mask')).toBeInTheDocument();
  });

  it('Displays the load mask when the map is loading', () => {
    const { getByTestId } = setup({
      app: { config: { mapbox_token: '123' } },
      map: { isLoading: true },
    });
    expect(getByTestId('load-mask')).toBeInTheDocument();
  });
});
