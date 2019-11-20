import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MapLayout from './map-layout.component';

jest.mock('mapbox-gl');

const mockStore = configureMockStore([thunk]);

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
          mapbox_token: 'token'
        }
      },
      map: {
        selectedMapStyle: {},
        isMultiMapMode: false
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
      }
    });

    const { container } = render(
      <Provider store={store}>
        <MapLayout />
      </Provider>
    );

    expect(container.querySelector('.layout-1')).toBeInTheDocument();
  });
});
