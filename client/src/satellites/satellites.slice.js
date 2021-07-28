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
 * @property {import('typings').Satellite[]} [satellites]
 * @property {import('typings').Scene[]} [scenes]
 * @property {import('typings').Scene} [hoveredScene]
 * @property {import('typings').Scene} [selectedScene]
 * @property {{message: string}} [error]
 * @property {import('typings').SavedSearch[]} [satelliteSearches]
 * @property {Partial<import('typings').SavedSearch>} [currentSearchQuery]
 * @property {'TCI'} [visualisationId]
 * @property {Record<string,string>} requests
 */

const name = 'satellites';

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  import('typings').Satellite[],
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
 *  import('typings').Scene[],
 *  Pick<import('typings').SavedSearch, 'satellites' | 'start_date' | 'end_date' | 'aoi'>,
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
 *  {rejectValue: {message: string}, state:import('typings').RootState }
 * >}
 */
export const saveImage = createAsyncThunk(
  `${name}/saveImage`,
  async (params, { getState, dispatch, rejectWithValue }) => {
    const { id: userId, customers } = userSelector(getState());
    const { id: customerId } = customers[0];
    const visualisationId = visualisationIdSelector(getState());
    const { satellite: satelliteId, id: sceneId } = selectedSceneSelector(
      getState(),
    );
    try {
      const imageSource = await apiClient.satellites.saveImage({
        userId,
        customerId,
        satelliteId,
        sceneId,
        visualisationId,
        ...params,
      });
      dispatch(addSource(imageSource));
      NotificationManager.success(`Successfully saved image ${params.name}`);
      return;
    } catch (responseError) {
      const { message } = responseError;
      NotificationManager.error(
        `Error saving image ${params.name}. Please try again`,
      );
      return rejectWithValue({ message });
    }
  },
  {
    condition: (_, { getState }) => {
      const requestId = getState().satellites.requests?.[`saveImage`];
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
  requests: {},
};

const satellitesSlice = createSlice({
  name,
  initialState,
  reducers: {
    /**
     * @type {import('@reduxjs/toolkit').CaseReducer<
     *  SatellitesState,
     *  import('@reduxjs/toolkit').PayloadAction<import('typings').Scene>
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
    builder.addCase(saveImage.pending, (state, { meta }) => {
      state.requests.saveImage = meta.requestId;
    });
    builder.addCase(saveImage.fulfilled, state => {
      state.requests.saveImage = undefined;
    });
    builder.addCase(saveImage.rejected, (state, { error }) => {
      state.requests.saveImage = undefined;
      state.error = { message: error.message };
    });
  },
});

export const {
  selectScene,
  setCurrentVisualisation,
  setHoveredScene,
} = satellitesSlice.actions;

/**
 * @param {import('typings').RootState} state
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
