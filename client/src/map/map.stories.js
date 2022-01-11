import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MapProvider } from 'MapContext';

import Map from './map.component';
import { initialState } from './map.slice';

const Index = {
  title: 'Map/Map',
  parameters: { chromatic: { disable: true } },
};

export default Index;

const MAPBOX_TOKEN =
  'pk.eyJ1IjoidGhlcm1jZXJ0IiwiYSI6ImNqbmN5N2F6NzBnODYza3A2anVqYWExOW8ifQ.10y0sH8cDQp9AfZNg1-M3Q';

const mockStore = configureMockStore([thunk]);

const defaultState = {
  app: {
    config: {
      mapbox_token: MAPBOX_TOKEN,
    },
  },
  map: {
    ...initialState,
  },
  layers: {
    extrudedMode: false,
  },
};

const Template = args => (
  <div style={{ width: '100%', height: '100vh' }}>
    <Provider store={mockStore({ ...defaultState, ...args.state })}>
      <MapProvider>
        <Map />
      </MapProvider>
    </Provider>
  </div>
);

export const Default = Template.bind({});

export const BookmarksLoading = Template.bind({});
BookmarksLoading.args = {
  state: {
    bookmarks: {
      isLoading: true,
    },
  },
};
