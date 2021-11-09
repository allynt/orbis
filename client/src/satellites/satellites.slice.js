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
 * @property {import('typings').Satellite[]} [satellites]
 * @property {import('typings').Scene[]} [scenes]
 * @property {import('typings').Scene} [hoveredScene]
 * @property {import('typings').Scene} [selectedScene]
 * @property {Partial<import('typings').SavedSearch>} [currentSearchQuery]
 * @property {'TCI'} [visualisationId]
 * @property {number[][]} [aoi]
 * @property {number} cloudCoverPercentage
 * ==== Control ====
 * @property {string} visiblePanel
 * @property {boolean} isDrawingSatelliteAoi
 * @property {boolean} selectedSceneLayerVisible
 * ==== Generic ====
 * @property {{message: string}} [error]
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
 *  Pick<import('typings').SavedSearch, 'satellites' | 'start_date' | 'end_date'>,
 *  {rejectValue: {message: string}, state: import('typings').RootState}
 * >}
 */
export const searchSatelliteScenes = createAsyncThunk(
  `${name}/searchSatelliteScenes`,
  async (query, { getState, rejectWithValue }) => {
    try {
      const aoi = satelliteAoiSelector(getState());
      return await apiClient.satellites.runQuery({ ...query, aoi });
    } catch (responseError) {
      /** @type {import('api-client').ResponseError} */
      const message = await responseError.getErrors();
      NotificationManager.error(`Problem performing search: ${message}`);
      return rejectWithValue({ message });
    }
  },
);

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  any,
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
      NotificationManager.success(`Successfully saved image '${params.name}'`);
      return;
    } catch (responseError) {
      const message = await responseError.getErrors();
      NotificationManager.error(
        `Error saving image: ${message} Please try again`,
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
  isDrawingSatelliteAoi: false,
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
     *  import('@reduxjs/toolkit').PayloadAction<import('typings').Scene>
     * >}
     */
    setHoveredScene: (state, { payload }) => {
      state.hoveredScene = payload;
    },
    selectScene: (state, { payload }) => {
      state.hoveredScene = undefined;
      state.selectedScene = payload;
      state.selectedSceneLayerVisible = true;
      state.visiblePanel = Panels.VISUALISATION;
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
    startDrawingSatelliteAoi: state => {
      state.isDrawingSatelliteAoi = true;
      if (state.aoi?.length >= 1) state.aoi = undefined;
    },
    endDrawingSatelliteAoi: (state, { payload }) => {
      state.isDrawingSatelliteAoi = false;
      state.aoi = payload;
    },
    onSatelliteUnmount: state => {
      state.isDrawingSatelliteAoi = false;
      state.visiblePanel = Panels.NONE;
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
    builder.addCase(searchSatelliteScenes.pending, (state, { meta }) => {
      state.requests = {
        ...state.requests,
        searchSatelliteScenes: meta.requestId,
      };
      state.currentSearchQuery = meta.arg;
      state.scenes = undefined;
      state.selectedScene = undefined;
      state.visiblePanel = Panels.RESULTS;
    });
    builder.addCase(searchSatelliteScenes.fulfilled, (state, { payload }) => {
      state.scenes = payload;
      state.requests = { ...state.requests, searchSatelliteScenes: undefined };
      state.error = undefined;
    });
    builder.addCase(searchSatelliteScenes.rejected, (state, { payload }) => {
      state.requests = { ...state.requests, searchSatelliteScenes: undefined };
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
  startDrawingSatelliteAoi,
  endDrawingSatelliteAoi,
  onSatelliteUnmount,
} = satellitesSlice.actions;

/**
 * @param {import('typings').RootState} state
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

export const satelliteAoiSelector = createSelector(
  baseSelector,
  state => state?.aoi,
);

export const cloudCoverPercentageSelector = createSelector(
  baseSelector,
  state => state?.cloudCoverPercentage,
);

export const visiblePanelSelector = createSelector(
  baseSelector,
  state => state?.visiblePanel,
);

export const isDrawingSatelliteAoiSelector = createSelector(
  baseSelector,
  state => state?.isDrawingSatelliteAoi,
);

export const selectedSceneLayerVisibleSelector = createSelector(
  baseSelector,
  state => state?.selectedSceneLayerVisible,
);

export const requestsSelector = createSelector(
  baseSelector,
  state => state?.requests,
);

export default satellitesSlice.reducer;
