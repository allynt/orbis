import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SatellitesProvider } from './satellites-context';
import { satellites, scenes } from './satellites-test-fixtures';
import Satellites from './satellites.component';
import {
  fetchSatellites,
  fetchSatelliteScenes,
  saveImage,
  selectScene,
  setCurrentVisualisation,
  setHoveredScene,
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
    thing           | action
    ${'satellites'} | ${fetchSatellites.fulfilled}
  `('fetches $thing if there are none', async ({ action }) => {
    const { store } = renderComponent({});
    await waitFor(() =>
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: action.type }),
        ]),
      ),
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
      const { getByRole } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
      });
      userEvent.click(getByRole(...VISUALISATION_TAB));
      expect(
        getByRole('heading', { name: 'Visualisation' }),
      ).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('Performs a search when the search button is clicked', async () => {
      const { getByRole, store } = renderComponent(undefined, [
        { geometry: { coordinates: [[123, 123]] } },
      ]);
      userEvent.click(getByRole('button', { name: 'Search' }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: fetchSatelliteScenes.fulfilled.type,
            }),
          ]),
        ),
      );
      expect(getByRole('slider')).toBeInTheDocument();
    });
  });

  describe('Results', () => {
    it(`dispatches ${setHoveredScene} when a scene is hovered`, () => {
      const { getByRole, store } = renderComponent();
      userEvent.click(getByRole(...RESULTS_TAB));
      fireEvent.mouseEnter(getByRole('button', { name: scenes[0].id }));
      expect(store.getActions()).toEqual(
        expect.arrayContaining([setHoveredScene(scenes[0])]),
      );
    });

    it(`dispatches ${selectScene} when a scene is clicked`, () => {
      const { getByRole, store } = renderComponent();
      userEvent.click(getByRole(...RESULTS_TAB));
      userEvent.click(getByRole('button', { name: scenes[0].id }));
      expect(store.getActions()).toEqual(
        expect.arrayContaining([selectScene(scenes[0])]),
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

    it('Hides the selectedSceneLayer when the show hide icon is clicked', () => {
      const { getByRole, getAllByRole } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
      });
      userEvent.click(getByRole(...VISUALISATION_TAB));
      userEvent.click(getAllByRole('checkbox', { name: 'Hide' })[0]);
      expect(
        getAllByRole('checkbox', { name: 'Show' }).length,
      ).toBeGreaterThanOrEqual(1);
    });

    it('Dispatches saveImage when the save image form is submitted', async () => {
      const { getByRole, store } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
      });
      userEvent.click(getByRole(...VISUALISATION_TAB));
      userEvent.click(getByRole('button', { name: 'Save Image' }));
      userEvent.type(getByRole('textbox', { name: 'Add Name' }), 'Test Name');
      userEvent.click(getByRole('button', { name: 'Save' }));
      await waitFor(() =>
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({ type: saveImage.pending.type }),
        ),
      );
    });
  });
});
