import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SatellitesProvider } from './satellites-context';
import { satellites, scenes } from './satellites-test-fixtures';
import Satellites from './satellites.component';
import {
  deletePinnedSceneSuccess,
  deleteSatelliteSearchSuccess,
  fetchPinnedScenesSuccess,
  fetchSatelliteScenesSuccess,
  fetchSatellitesSearchesSuccess,
  fetchSatellitesSuccess,
  pinSceneSuccess,
  saveSatelliteSearchSuccess,
  selectScene,
  setCurrentSatelliteSearchQuery,
  setCurrentVisualisation,
} from './satellites.slice';

const mockStore = configureMockStore([thunk]);

/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const SEARCH_TAB = ['tab', { name: 'Search' }];
/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const RESULTS_TAB = ['tab', { name: 'Results' }];
/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const VISUALISATION_TAB = ['tab', { name: 'Visualisation' }];

const renderComponent = (state = { satellites, scenes }, defaultFeatures) => {
  const store = mockStore({ accounts: {}, app: {}, satellites: state });
  const utils = render(
    <Provider store={store}>
      <SatellitesProvider defaultFeatures={defaultFeatures}>
        <Satellites />
      </SatellitesProvider>
    </Provider>,
  );
  return { ...utils, store };
};

describe('Satellites', () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify([], { status: 200 }));
  });

  it.each`
    thing               | action
    ${'satellites'}     | ${fetchSatellitesSuccess}
    ${'pinned scenes'}  | ${fetchPinnedScenesSuccess}
    ${'saved searches'} | ${fetchSatellitesSearchesSuccess}
  `('fetches $thing if there are none', async ({ action }) => {
    const { store } = renderComponent({});
    await waitFor(() =>
      expect(store.getActions()).toContainEqual(action(expect.anything())),
    );
  });

  describe('top navigation', () => {
    describe('has results and visualisation disabled when no search has been made', () => {
      it('results', () => {
        const { getByRole } = renderComponent({});
        expect(getByRole(...RESULTS_TAB)).toBeDisabled();
      });

      it('visualisation', () => {
        const { getByRole } = renderComponent();
        expect(getByRole(...VISUALISATION_TAB)).toBeDisabled();
      });
    });

    it('has visualisation disabled when no scene has been selected', () => {
      const { getByRole } = renderComponent({
        scenes,
        selectedScene: null,
      });
      expect(getByRole(...RESULTS_TAB)).not.toBeDisabled();
      expect(getByRole(...VISUALISATION_TAB)).toBeDisabled();
    });

    it('has free navigation when each step has been completed', () => {
      const { getByRole } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
      });
      expect(getByRole(...RESULTS_TAB)).not.toBeDisabled();
      expect(getByRole(...VISUALISATION_TAB)).not.toBeDisabled();
    });

    it('Shows the search view when the search nav button is clicked', () => {
      const { getByRole } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
      });
      userEvent.click(getByRole(...SEARCH_TAB));
      expect(
        getByRole('button', { name: 'Draw your AOI' }),
      ).toBeInTheDocument();
    });

    it('Shows the Results view when the Results nav button is clicked', () => {
      const { getByRole } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
      });
      userEvent.click(getByRole(...RESULTS_TAB));
      expect(getByRole('slider')).toBeInTheDocument();
    });

    it('Shows the Visualisation view when the Visualisation nav button is clicked', () => {
      const { getByRole, getByText } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
      });
      userEvent.click(getByRole(...VISUALISATION_TAB));
      expect(getByText('VISUALISATION')).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    const savedSearches = [
      { id: 1, name: '1', tiers: [] },
      { id: 2, name: '2', tiers: [] },
    ];

    it('Performs a search when the search button is clicked', async () => {
      const { getByRole, store } = renderComponent(undefined, [
        { geometry: { coordinates: [[123, 123]] } },
      ]);
      userEvent.click(getByRole('button', { name: 'Search' }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            setCurrentSatelliteSearchQuery(expect.anything()),
          ]),
        ),
      );
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          fetchSatelliteScenesSuccess(expect.anything()),
        ]),
      );
      expect(getByRole('slider')).toBeInTheDocument();
    });

    it(`Dispatches ${setCurrentSatelliteSearchQuery} action when a search is reloaded`, () => {
      const { getAllByRole, store } = renderComponent({
        satellites,
        satelliteSearches: savedSearches,
      });
      userEvent.click(getAllByRole('button', { name: 'Reload' })[0]);
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          setCurrentSatelliteSearchQuery(savedSearches[0]),
        ]),
      );
    });

    it(`Dispatches deleteSavedSatelliteSearch action when a search is reloaded`, async () => {
      const { getAllByRole, store } = renderComponent({
        satellites,
        satelliteSearches: savedSearches,
      });
      userEvent.click(getAllByRole('button', { name: 'Delete' })[1]);
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            deleteSatelliteSearchSuccess(savedSearches[1].id),
          ]),
        ),
      );
    });
  });

  describe('Results', () => {
    it(`dispatches ${selectScene} when a scene is clicked`, () => {
      const { getByRole, store } = renderComponent();
      userEvent.click(getByRole(...RESULTS_TAB));
      userEvent.click(getByRole('button', { name: scenes[0].id }));
      expect(store.getActions()).toEqual(
        expect.arrayContaining([selectScene(scenes[0])]),
      );
    });

    it(`dispatches pinScene when a scene is pinned`, async () => {
      const { getByRole, store } = renderComponent();
      userEvent.click(getByRole(...RESULTS_TAB));
      userEvent.click(getByRole('button', { name: 'pin-icon-32UVD' }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([pinSceneSuccess(expect.anything())]),
        ),
      );
    });

    it(`dispatches deletePinnedScene when a scene is unpinned`, async () => {
      const { getByRole, store } = renderComponent({
        satellites,
        scenes,
        pinnedScenes: [{ ...scenes[0] }],
      });
      userEvent.click(getByRole(...RESULTS_TAB));
      userEvent.click(getByRole('button', { name: 'pin-icon-32UVD' }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([deletePinnedSceneSuccess(expect.anything())]),
        ),
      );
    });

    it(`Dispatches saveSatelliteSearch when the search is saved`, async () => {
      const { getByRole, store } = renderComponent();
      userEvent.click(getByRole(...RESULTS_TAB));
      userEvent.click(getByRole('button', { name: 'Save Search' }));
      userEvent.type(getByRole('textbox'), 'Test Name');
      userEvent.click(getByRole('button', { name: 'Save Search' }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            saveSatelliteSearchSuccess(expect.anything()),
          ]),
        ),
      );
    });
  });

  describe('Visualisation', () => {
    it(`Dispatches ${setCurrentVisualisation} when a visualisation is clicked`, () => {
      const { getByRole, store } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
      });
      userEvent.click(getByRole(...VISUALISATION_TAB));
      userEvent.click(
        getByRole('button', {
          name: 'Scene Visualisation Thumbnail True Color Based on bands 4,3,2',
        }),
      );
      expect(store.getActions()).toEqual(
        expect.arrayContaining([setCurrentVisualisation(expect.anything())]),
      );
    });
  });
});
