import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MapLayout from './map-layout.component';

jest.mock('mapbox-gl');

const mockStore = configureMockStore([thunk]);

describe('Map Layout Component', () => {
  afterEach(cleanup);

  it('should render a single map', () => {
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
