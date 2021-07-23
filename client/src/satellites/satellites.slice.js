import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import { userSelector } from 'accounts/accounts.selectors';
import apiClient from 'api-client';
import { addSource } from 'data-layers/data-layers.slice';

/**
 * @typedef SatellitesState
 * @property {import('typings/satellites').Satellite[]} [satellites]
 * @property {import('typings/satellites').Scene[]} [scenes]
 * @property {import('typings/satellites').Scene} [hoveredScene]
 * @property {import('typings/satellites').Scene} [selectedScene]
 * @property {{message: string}} [error]
 * @property {import('typings/satellites').SavedSearch[]} [satelliteSearches]
 * @property {Partial<import('typings/satellites').SavedSearch>} [currentSearchQuery]
 * @property {'TCI'} [visualisationId]
 */

const name = 'satellites';

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  import('typings/satellites').Satellite[],
 *  undefined,
 *  {rejectValue: {message: string}}
 * >}
 */
export const fetchSatellites = createAsyncThunk(
  `${name}/fetchSatellites`,
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.satellites.getSatellites();
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Fetching Satellites Error - ${message}`,
        50000,
        () => {},
      );
      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
);

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  import('typings/satellites').Scene[],
 *  Pick<import('typings/satellites').SavedSearch, 'satellites' | 'start_date' | 'end_date' | 'aoi'>,
 *  {rejectValue: {message: string}}
 * >}
 */
export const fetchSatelliteScenes = createAsyncThunk(
  `${name}/fetchSatelliteScenes`,
  async (query, { rejectWithValue }) => {
    try {
      return await apiClient.satellites.runQuery(query);
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Fetching Satellites Error - ${message}`,
        50000,
        () => {},
      );
      return rejectWithValue({
        message: `${status} ${message}`,
      });
    }
  },
);

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  void,
 *  {name: string, description?: string},
 *  {rejectValue: {message: string}, state:import('react-redux').DefaultRootState }
 * >}
 */
export const saveImage = createAsyncThunk(
  `${name}/saveImage`,
  async (params, { getState, dispatch }) => {
    const { id: userId, customers } = userSelector(getState());
    const { id: customerId } = customers[0];
    const visualisationId = visualisationIdSelector(getState());
    const { satellite: satelliteId, id: sceneId } = selectedSceneSelector(
      getState(),
    );
    const imageSource = await apiClient.satellites.saveImage({
      userId,
      customerId,
      satelliteId,
      sceneId,
      visualisationId,
      ...params,
    });
    dispatch(addSource(imageSource));
    return;
  },
  {
    condition: (_, { getState }) => {
      const visualisationId = visualisationIdSelector(getState());
      const { satellite: satelliteId, id: sceneId } = selectedSceneSelector(
        getState(),
      );
      const requestId = getState().satellites.requests?.[
        `saveImage/${satelliteId}/${sceneId}/${visualisationId}`
      ];
      return !requestId;
    },
  },
);

/**
 * @type {SatellitesState}
 */
const initialState = {
  satellites: null,
  scenes: null,
  selectedScene: null,
  error: null,
  satelliteSearches: null,
  visualisationId: 'TCI',
};

const satellitesSlice = createSlice({
  name,
  initialState,
  reducers: {
    /**
     * @type {import('@reduxjs/toolkit').CaseReducer<
     *  SatellitesState,
     *  import('@reduxjs/toolkit').PayloadAction<import('typings/satellites').Scene>
     * >}
     */
    setHoveredScene: (state, { payload }) => {
      state.hoveredScene = payload;
    },
    selectScene: (state, { payload }) => {
      state.hoveredScene = undefined;
      state.selectedScene = payload;
    },
    setCurrentVisualisation: (state, { payload }) => {
      state.visualisationId = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSatellites.fulfilled, (state, { payload }) => {
      state.satellites = payload;
      state.error = null;
    });
    builder.addCase(fetchSatellites.rejected, (state, { payload }) => {
      state.error = payload;
    });
    builder.addCase(fetchSatelliteScenes.pending, (state, { meta }) => {
      state.currentSearchQuery = meta.arg;
      state.selectedScene = null;
    });
    builder.addCase(fetchSatelliteScenes.fulfilled, (state, { payload }) => {
      state.scenes = payload;
      state.error = null;
    });
    builder.addCase(fetchSatelliteScenes.rejected, (state, { payload }) => {
      state.error = payload;
    });
  },
});

export const {
  selectScene,
  setCurrentVisualisation,
  setHoveredScene,
} = satellitesSlice.actions;

/**
 * @param {import('react-redux').DefaultRootState} state
 */
const baseSelector = state => state?.satellites;

export const selectedPinnedScenesSelector = createSelector(
  baseSelector,
  satellites => satellites?.selectedPinnedScenes || [],
);

export const satellitesSelector = createSelector(
  baseSelector,
  state => state?.satellites,
);

export const scenesSelector = createSelector(
  baseSelector,
  state => state?.scenes,
);

export const selectedSceneSelector = createSelector(
  baseSelector,
  state => state?.selectedScene,
);

export const pinnedScenesSelector = createSelector(
  baseSelector,
  state => state?.pinnedScenes,
);

export const currentSearchQuerySelector = createSelector(
  baseSelector,
  state => state?.currentSearchQuery,
);

export const visualisationIdSelector = createSelector(
  baseSelector,
  state => state?.visualisationId,
);

export const savedSearchesSelector = createSelector(
  baseSelector,
  state => state?.satelliteSearches,
);

export const hoveredSceneSelector = createSelector(
  baseSelector,
  state => state?.hoveredScene,
);

export default satellitesSlice.reducer;
