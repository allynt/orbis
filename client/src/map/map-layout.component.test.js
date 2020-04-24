import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MapLayout from './map-layout.component';

jest.mock('mapbox-gl');

const mockStore = configureMockStore([thunk]);

const MAPSTYLES = [
  {
    id: 'light',
    uri: 'mapbox://styles/mapbox/light-v10',
    title: 'Light'
  },
  {
    id: 'dark',
    uri: 'mapbox://styles/mapbox/dark-v10',
    title: 'Dark'
  }
];

describe('Map Layout Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  afterEach(cleanup);

  it('should render a single map', () => {
    fetch.mockResponse(JSON.stringify([], { status: 200 }));

    const store = mockStore({
      app: {
        config: {
          mapbox_token: 'token',
          mapStyles: MAPSTYLES
        }
      },
      map: {
        isMultiMapMode: false,
        selectedMapStyle: MAPSTYLES[0]
      },
      data: {
        layers: []
      },
      satellites: {
        selectedScene: null
      },
      annotations: {
        textLabelSelected: false
      },
      bookmarks: {
        selectedBookmarks: []
      },
      accounts: {
        userKey: '123',
        user: {
          id: 1
        },
        error: null
      },
      sidebar: {
        isMenuVisible: false,
        visibleMenuItem: ''
      },
      stories: {
        stories: [],
        selectedStory: null
      }
    });

    const { container } = render(
      <Provider store={store}>
        <MapLayout count={1} />
      </Provider>
    );

    expect(container.querySelector('.layout-1')).toBeInTheDocument();
  });
});
