import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import { userSelector } from 'accounts/accounts.selectors';
import apiClient from 'api-client';
import { addSource } from 'data-layers/data-layers.slice';

import { DEFAULT_CLOUD_COVER, Panels } from './satellite.constants';

/**
 * @typedef SatellitesState
 * ==== Fetched or selected ====
 * @property {import('typings/satellites').Satellite[]} [satellites]
 * @property {import('typings/satellites').Scene[]} [scenes]
 * @property {import('typings/satellites').Scene} [hoveredScene]
 * @property {import('typings/satellites').Scene} [selectedScene]
 * @property {Partial<import('typings/satellites').SavedSearch>} [currentSearchQuery]
 * @property {'TCI'} [visualisationId]
 * @property {number[][]} [aoi]
 * @property {number} cloudCoverPercentage
 * ==== Control ====
 * @property {string} visiblePanel
 * @property {boolean} isDrawingAoi
 * @property {boolean} selectedSceneLayerVisible
 * ==== Generic ====
 * @property {{message: string}} [error]
 * @property {Record<string,string>} requests
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
 *  any,
 *  {name: string, description?: string},
 *  {rejectValue: {message: string}, state:import('react-redux').DefaultRootState }
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
  visualisationId: 'TCI',
  cloudCoverPercentage: DEFAULT_CLOUD_COVER,
  isDrawingAoi: false,
  visiblePanel: Panels.SEARCH,
  selectedSceneLayerVisible: false,
  requests: {},
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
    setVisualisationId: (state, { payload }) => {
      state.visualisationId = payload;
    },
    setCloudCoverPercentage: (state, { payload }) => {
      state.cloudCoverPercentage = payload;
    },
    setSelectedSceneLayerVisible: (state, { payload }) => {
      state.selectedSceneLayerVisible = payload;
    },
    setVisiblePanel: (state, { payload }) => {
      state.visiblePanel = payload;
    },
    startDrawingAoi: state => {
      state.isDrawingAoi = true;
      if (state.aoi?.length >= 1) state.aoi = undefined;
    },
    endDrawingAoi: (state, { payload }) => {
      state.isDrawingAoi = false;
      state.aoi = payload;
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
  setVisualisationId,
  setHoveredScene,
  setCloudCoverPercentage,
  setSelectedSceneLayerVisible,
  setVisiblePanel,
  startDrawingAoi,
  endDrawingAoi,
} = satellitesSlice.actions;

/**
 * @param {import('react-redux').DefaultRootState} state
 */
const baseSelector = state => state?.satellites;

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

export const currentSearchQuerySelector = createSelector(
  baseSelector,
  state => state?.currentSearchQuery,
);

export const visualisationIdSelector = createSelector(
  baseSelector,
  state => state?.visualisationId,
);

export const hoveredSceneSelector = createSelector(
  baseSelector,
  state => state?.hoveredScene,
);

export const aoiSelector = createSelector(baseSelector, state => state?.aoi);

export const cloudCoverPercentageSelector = createSelector(
  baseSelector,
  state => state?.cloudCoverPercentage,
);

export const visiblePanelSelector = createSelector(
  baseSelector,
  state => state?.visiblePanel,
);

export const isDrawingAoiSelector = createSelector(
  baseSelector,
  state => state?.isDrawingAoi,
);

export const selectedSceneLayerVisibleSelector = createSelector(
  baseSelector,
  state => state?.selectedSceneLayerVisible,
);

export default satellitesSlice.reducer;
