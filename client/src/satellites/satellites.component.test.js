import { fireEvent, render, screen, waitFor, userEvent } from 'test/test-utils';

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
  startDrawingSatelliteAoi,
} from './satellites.slice';

/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const SEARCH_TAB = ['tab', { name: 'Search' }];
/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const RESULTS_TAB = ['tab', { name: 'Results' }];
/** @type {[matcher: import('@testing-library/react').ByRoleMatcher, options?: import('@testing-library/react').ByRoleOptions]} */
const VISUALISATION_TAB = ['tab', { name: 'Visualisation' }];

describe('Satellites', () => {
  let state;

  beforeEach(() => {
    state = {
      accounts: {},
      app: { config: { maximumAoiArea: 20 } },
      satellites: { satellites, scenes },
    };
  });

  it.each`
    thing           | action
    ${'satellites'} | ${fetchSatellites.fulfilled}
  `('fetches $thing if there are none', async ({ action }) => {
    const { store } = render(<Satellites />, { state: {} });

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
        render(<Satellites />, { state: {} });
        expect(screen.getByRole(...RESULTS_TAB)).toBeDisabled();
      });

      it('visualisation', () => {
        render(<Satellites />, { state });
        expect(screen.getByRole(...VISUALISATION_TAB)).toBeDisabled();
      });
    });

    it('has visualisation disabled when no scene has been selected', () => {
      render(<Satellites />, {
        state: {
          ...state,
          satellites: { scenes, selectedScene: null },
        },
      });

      expect(screen.getByRole(...RESULTS_TAB)).toBeEnabled();
      expect(screen.getByRole(...VISUALISATION_TAB)).toBeDisabled();
    });

    it('has free navigation when each step has been completed', () => {
      render(<Satellites />, {
        state: {
          ...state,
          satellites: { satellites, scenes, selectedScene: scenes[0] },
        },
      });

      expect(screen.getByRole(...RESULTS_TAB)).toBeEnabled();
      expect(screen.getByRole(...VISUALISATION_TAB)).toBeEnabled();
    });

    it.each`
      panel                   | matcher
      ${Panels.SEARCH}        | ${SEARCH_TAB}
      ${Panels.RESULTS}       | ${RESULTS_TAB}
      ${Panels.VISUALISATION} | ${VISUALISATION_TAB}
    `(
      'Dispatches setVisiblePanel when the $panel nav button is clicked',
      ({ panel, matcher }) => {
        const { store } = render(<Satellites />, {
          state: {
            ...state,
            satellites: { satellites, scenes, selectedScene: scenes[0] },
          },
        });

        userEvent.click(screen.getByRole(...matcher));
        expect(store.getActions()).toContainEqual(setVisiblePanel(panel));
      },
    );
  });

  describe('Search', () => {
    it('Dispatches the startDrawingAoi action when the Draw Aoi button is clicked', () => {
      const { store } = render(<Satellites />, {
        state: {
          ...state,
          satellites: {
            visiblePanel: Panels.SEARCH,
            satellites,
          },
        },
      });

      userEvent.click(screen.getByRole('button', { name: /Draw your AOI/i }));
      expect(store.getActions()).toContainEqual(startDrawingSatelliteAoi());
    });

    it('Performs a search when the search button is clicked', async () => {
      const { store } = render(<Satellites />, {
        state: {
          ...state,
          satellites: {
            visiblePanel: Panels.SEARCH,
            satellites,
            aoi: Array(4).fill([123, 123]),
          },
        },
      });

      userEvent.click(screen.getByRole('button', { name: 'Search' }));
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
      render(<Satellites />, {
        state: {
          ...state,
          satellites: {
            visiblePanel: Panels.SEARCH,
            satellites,
            aoi: [
              [0, 0],
              [55, 0],
              [55, 55],
              [0, 55],
              [0, 0],
            ],
          },
        },
      });

      expect(screen.getByText('AOI is too large')).toBeInTheDocument();
    });
  });

  describe('Results', () => {
    it(`dispatches ${setHoveredScene} when a scene is hovered`, () => {
      const { store } = render(<Satellites />, {
        state: {
          ...state,
          satellites: {
            satellites,
            scenes,
            visiblePanel: Panels.RESULTS,
          },
        },
      });

      fireEvent.mouseEnter(screen.getByRole('button', { name: scenes[0].id }));
      expect(store.getActions()).toEqual(
        expect.arrayContaining([setHoveredScene(scenes[0])]),
      );
    });

    it(`dispatches ${selectScene} when a scene is clicked`, () => {
      const { store } = render(<Satellites />, {
        state: {
          ...state,
          satellites: {
            satellites,
            scenes,
            visiblePanel: Panels.RESULTS,
          },
        },
      });

      userEvent.click(screen.getByRole('button', { name: scenes[0].id }));
      expect(store.getActions()).toEqual(
        expect.arrayContaining([selectScene(scenes[0])]),
      );
    });
  });

  describe('Visualisation', () => {
    it(`Dispatches ${setVisualisationId} when a visualisation is clicked`, () => {
      const { store } = render(<Satellites />, {
        state: {
          ...state,
          satellites: {
            satellites,
            scenes,
            selectedScene: scenes[0],
            visiblePanel: Panels.VISUALISATION,
          },
        },
      });

      userEvent.click(
        screen.getByRole('button', {
          name: 'Scene Visualisation Thumbnail True Color Based on bands 4,3,2',
        }),
      );
      expect(store.getActions()).toContainEqual(
        setVisualisationId(expect.anything()),
      );
    });

    it('Hides the selectedSceneLayer when the show hide icon is clicked', () => {
      const { store } = render(<Satellites />, {
        state: {
          ...state,
          satellites: {
            satellites,
            scenes,
            selectedScene: scenes[0],
            selectedSceneLayerVisible: true,
            visiblePanel: Panels.VISUALISATION,
          },
        },
      });

      userEvent.click(screen.getAllByRole('checkbox', { name: 'Hide' })[0]);
      expect(store.getActions()).toContainEqual(
        setSelectedSceneLayerVisible(false),
      );
    });

    it('Dispatches saveImage when the save image form is submitted', async () => {
      const { store } = render(<Satellites />, {
        state: {
          ...state,
          satellites: {
            satellites,
            scenes,
            selectedScene: scenes[0],
            visiblePanel: Panels.VISUALISATION,
          },
        },
      });

      userEvent.click(screen.getByRole('button', { name: 'Save Image' }));
      userEvent.type(
        screen.getByRole('textbox', { name: 'Add Name' }),
        'Test Name',
      );
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() =>
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({ type: saveImage.pending.type }),
        ),
      );
    });
  });
});
