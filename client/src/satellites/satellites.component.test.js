import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { satellites, scenes } from './satellites-test-fixtures';
import Satellites from './satellites.component';
import { fetchPinnedScenes } from './satellites.slice';

const mockStore = configureMockStore([thunk]);

const MAPSTYLES = [
  {
    id: 'light',
    uri: 'mapbox://styles/mapbox/light-v10',
    title: 'Light',
  },
  {
    id: 'dark',
    uri: 'mapbox://styles/mapbox/dark-v10',
    title: 'Dark',
  },
];

const baseStore = {
  accounts: { userKey: null },
  app: {
    config: {
      mapbox_token: 'token',
      mapStyles: MAPSTYLES,
    },
  },
  map: {
    isCompareMode: false,
  },
};

const selectedScene = scenes[0];

describe('Satellites', () => {
  let fetchPinnedScenes = null;

  beforeEach(() => {
    fetch.mockResponse(JSON.stringify([], { status: 200 }));

    fetchPinnedScenes = jest.fn();
  });

  describe('top navigation', () => {
    describe('has results and visualisation disabled when no search has been made', () => {
      let store;

      beforeEach(() => {
        store = mockStore({
          ...baseStore,
          satellites: { satellites, scenes: undefined, selectedScene: null },
        });
      });

      it('results', () => {
        const { getByRole } = render(
          <Provider store={store}>
            <Satellites />
          </Provider>,
        );
        expect(getByRole('button', { name: 'Results' })).toBeDisabled();
      });

      it('visualisation', () => {
        const { getByRole } = render(
          <Provider store={store}>
            <Satellites />
          </Provider>,
        );
        expect(getByRole('button', { name: 'Visualisation' })).toBeDisabled();
      });
    });

    it('has visualisation disabled when no scene has been selected', () => {
      const store = mockStore({
        ...baseStore,
        satellites: {
          scenes,
          selectedScene: null,
        },
      });
      const { getByRole } = render(
        <Provider store={store}>
          <Satellites />
        </Provider>,
      );
      expect(getByRole('button', { name: 'Results' })).not.toBeDisabled();
      expect(getByRole('button', { name: 'Visualisation' })).toBeDisabled();
    });

    it('has free navigation when each step has been completed', () => {
      const store = mockStore({
        ...baseStore,
        satellites: { satellites, scenes, selectedScene },
      });
      const { getByRole } = render(
        <Provider store={store}>
          <Satellites />
        </Provider>,
      );
      expect(getByRole('button', { name: 'Results' })).not.toBeDisabled();
      expect(getByRole('button', { name: 'Visualisation' })).not.toBeDisabled();
    });
  });
});
