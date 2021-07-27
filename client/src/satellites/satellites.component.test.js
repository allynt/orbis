import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Panels } from './satellite.constants';
import { satellites, scenes } from './satellites-test-fixtures';
import Satellites from './satellites.component';
import {
  fetchSatellites,
  searchSatelliteScenes,
  saveImage,
  selectScene,
  setVisualisationId,
  setHoveredScene,
  setSelectedSceneLayerVisible,
  setVisiblePanel,
  startDrawingAoi,
} from './satellites.slice';

const mockStore = configureMockStore([thunk]);

/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const SEARCH_TAB = ['tab', { name: 'Search' }];
/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const RESULTS_TAB = ['tab', { name: 'Results' }];
/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const VISUALISATION_TAB = ['tab', { name: 'Visualisation' }];

const renderComponent = (state = { satellites, scenes }) => {
  const store = mockStore({
    accounts: {},
    app: { config: { maximumAoiArea: 20 } },
    satellites: state,
  });
  const utils = render(
    <Provider store={store}>
      <Satellites />
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

    it.each`
      panel                   | matcher
      ${Panels.SEARCH}        | ${SEARCH_TAB}
      ${Panels.RESULTS}       | ${RESULTS_TAB}
      ${Panels.VISUALISATION} | ${VISUALISATION_TAB}
    `(
      'Dispatches setVisiblePanel when the $panel nav button is clicked',
      ({ panel, matcher }) => {
        const { getByRole, store } = renderComponent({
          satellites,
          scenes,
          selectedScene: scenes[0],
        });
        userEvent.click(getByRole(...matcher));
        expect(store.getActions()).toContainEqual(setVisiblePanel(panel));
      },
    );
  });

  describe('Search', () => {
    it('Dispatches the startDrawingAoi action when the Draw Aoi button is clicked', () => {
      const { getByRole, store } = renderComponent({
        visiblePanel: Panels.SEARCH,
        satellites,
      });
      userEvent.click(getByRole('button', { name: /Draw your AOI/i }));
      expect(store.getActions()).toContainEqual(startDrawingAoi());
    });

    it('Performs a search when the search button is clicked', async () => {
      const { getByRole, store } = renderComponent({
        visiblePanel: Panels.SEARCH,
        satellites,
        aoi: Array(4).fill([123, 123]),
      });
      userEvent.click(getByRole('button', { name: 'Search' }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: searchSatelliteScenes.fulfilled.type,
            }),
          ]),
        ),
      );
    });

    it('Shows an error if the aoi is too large', () => {
      const { getByText } = renderComponent({
        visiblePanel: Panels.SEARCH,
        satellites,
        aoi: [
          [0, 0],
          [55, 0],
          [55, 55],
          [0, 55],
          [0, 0],
        ],
      });
      expect(getByText('AOI is too large')).toBeInTheDocument();
    });
  });

  describe('Results', () => {
    it(`dispatches ${setHoveredScene} when a scene is hovered`, () => {
      const { getByRole, store } = renderComponent({
        satellites,
        scenes,
        visiblePanel: Panels.RESULTS,
      });
      fireEvent.mouseEnter(getByRole('button', { name: scenes[0].id }));
      expect(store.getActions()).toEqual(
        expect.arrayContaining([setHoveredScene(scenes[0])]),
      );
    });

    it(`dispatches ${selectScene} when a scene is clicked`, () => {
      const { getByRole, store } = renderComponent({
        satellites,
        scenes,
        visiblePanel: Panels.RESULTS,
      });
      userEvent.click(getByRole('button', { name: scenes[0].id }));
      expect(store.getActions()).toEqual(
        expect.arrayContaining([selectScene(scenes[0])]),
      );
    });
  });

  describe('Visualisation', () => {
    it(`Dispatches ${setVisualisationId} when a visualisation is clicked`, () => {
      const { getByRole, store } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
        visiblePanel: Panels.VISUALISATION,
      });
      userEvent.click(
        getByRole('button', {
          name: 'Scene Visualisation Thumbnail True Color Based on bands 4,3,2',
        }),
      );
      expect(store.getActions()).toContainEqual(
        setVisualisationId(expect.anything()),
      );
    });

    it('Hides the selectedSceneLayer when the show hide icon is clicked', () => {
      const { getAllByRole, store } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
        selectedSceneLayerVisible: true,
        visiblePanel: Panels.VISUALISATION,
      });
      userEvent.click(getAllByRole('checkbox', { name: 'Hide' })[0]);
      expect(store.getActions()).toContainEqual(
        setSelectedSceneLayerVisible(false),
      );
    });

    it('Dispatches saveImage when the save image form is submitted', async () => {
      const { getByRole, store } = renderComponent({
        satellites,
        scenes,
        selectedScene: scenes[0],
        visiblePanel: Panels.VISUALISATION,
      });
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
