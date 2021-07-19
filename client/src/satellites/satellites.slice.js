import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';

/**
 * @typedef SatellitesState
 * @property {import('typings/satellites').Satellite[]} [satellites]
 * @property {import('typings/satellites').Scene[]} [scenes]
 * @property {import('typings/satellites').Scene} [selectedScene]
 * @property {any} [error]
 * @property {import('typings/satellites').SavedSearch[]} [satelliteSearches]
 * @property {Partial<import('typings/satellites').SavedSearch>} [currentSearchQuery]
 * @property {'TCI'} visualisationId
 */

const name = 'satellites';

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<import('typings/satellites').Satellite[], undefined, {}>}
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
 *  Pick<import('typings/satellites').SavedSearch, 'satellites' | 'start_date' | 'end_date'>,
 *  {}
 * >}
 */
export const fetchSatelliteScenes = createAsyncThunk(
  `${name}/fetchSatelliteScenes`,
  async (query, { rejectWithValue }) => {
    // dispatch(removeScenes());
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
// export const fetchSatelliteScenes = query => async dispatch => {
//   dispatch(removeScenes());
//   try {
//     const scenes = await apiClient.satellites.runQuery(query);
//     return dispatch(fetchSatelliteScenesSuccess(scenes));
//   } catch (error) {
//     /** @type {import('api-client').ResponseError} */
//     const { message, status } = error;
//     NotificationManager.error(
//       `${status} ${message}`,
//       `Fetching Satellites Error - ${message}`,
//       50000,
//       () => {},
//     );
//     return dispatch(
//       fetchSatelliteScenesFailure({
//         message: `${status} ${message}`,
//       }),
//     );
//   }
// };

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
    selectScene: (state, { payload }) => {
      state.selectedScene = payload;
    },
    setCurrentSatelliteSearchQuery: (state, { payload }) => {
      state.currentSearchQuery = payload;
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
    builder.addCase(fetchSatelliteScenes.pending, state => {
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
  setCurrentSatelliteSearchQuery,
  setCurrentVisualisation,
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

export default satellitesSlice.reducer;
