import { FlyToInterpolator } from '@deck.gl/core';
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';

import { Panels } from '../data-layers.constants';

const name = 'aois';

export const fetchAois = createAsyncThunk(
  `${name}/fetchAois`,
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.aois.getAois();
    } catch (error) {
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Fetching AOI Error - ${message}`,
        50000,
        () => {},
      );
      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
);

export const saveAoi = createAsyncThunk(
  `${name}/saveAoi`,
  async (params, { getState, dispatch, rejectWithValue }) => {
    const geometry = getState().aois.aoi?.geometry;

    try {
      const aoi = await apiClient.aois.saveAoi({ ...params, geometry });
      NotificationManager.success(`Successfully saved AOI '${aoi.name}'`);

      return aoi;
    } catch (responseError) {
      const message = await responseError.getErrors();
      NotificationManager.error(
        `Error saving AOI: ${message} Please try again`,
      );

      return rejectWithValue({ message });
    }
  },
);

export const updateAoiDetails = createAsyncThunk(
  `${name}/updateAoi`,
  async (params, { dispatch, rejectWithValue }) => {
    const updatedParams = {
      id: params.id,
      name: params.name,
      description: params.description,
    };

    try {
      const aoi = await apiClient.aois.updateAoi({ ...updatedParams });
      NotificationManager.success(`Successfully updated AOI '${aoi.name}'`);
      dispatch(updateAoi(aoi));
      return aoi;
    } catch (responseError) {
      const message = await responseError.getErrors();
      NotificationManager.error(
        `Error updating AOI: ${message} Please try again`,
      );
      return rejectWithValue({ message });
    }
  },
);

export const deleteAoi = createAsyncThunk(
  `${name}/deleteAoi`,
  async (aoi, { rejectWithValue }) => {
    try {
      await apiClient.aois.deleteAoi(aoi.id);
      NotificationManager.success(
        '',
        `Successfully deleted ${aoi.name}`,
        5000,
        () => {},
      );
      return aoi;
    } catch (error) {
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Deleting AOI Error`,
        50000,
        () => {},
      );

      return rejectWithValue({
        message: `${status} ${message}`,
      });
    }
  },
);

export const selectAoi = createAsyncThunk(
  `${name}/selectAoi`,
  async ({ aoi }, { dispatch }) => {
    console.log('USING AOI: ', aoi);
    dispatch(setSelectedAoi(aoi));

    if (aoi.data_source) {
      dispatch(push(`dashboard?source_id=${aoi.data_source}`));
    }
  },
);

const initialState = {
  selectedAoi: null,
  aois: null,
  error: null,
  isLoading: false,
  isDrawingAoi: false,
  visiblePanel: Panels.DATA_LAYERS,
};

const aoiSlice = createSlice({
  name,
  initialState,
  reducers: {
    startDrawingAoi: state => {
      state.isDrawingAoi = true;
      state.aoi = undefined;
    },
    endDrawingAoi: (state, { payload }) => {
      if ('type' in payload) {
        state.aoi = payload.features[0];
      }
      state.isDrawingAoi = false;
    },
    setAoiFeatures: (state, { payload }) => {
      'type' in payload
        ? (state.aoi = payload.features[0])
        : (state.aoi = payload);
    },
    onUnmount: state => {
      state.isDrawingAoi = false;
    },
    setVisiblePanel: (state, { payload }) => {
      state.visiblePanel = payload;
    },
    setSelectedAoi: (state, { payload }) => {
      state.selectedAoi = payload;
    },
    updateAoi: (state, { payload }) => {
      state.aois = state.aois.map(aoi =>
        aoi.id !== payload.id ? aoi : payload,
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAois.fulfilled, (state, { payload }) => {
      state.aois = payload;
      state.error = null;
    });
    builder.addCase(fetchAois.rejected, (state, { payload }) => {
      state.error = payload;
    });
    builder.addCase(saveAoi.fulfilled, (state, { payload }) => {
      state.aois = state.aois ? [payload, ...state.aois] : [payload];
      state.error = null;
    });
    builder.addCase(saveAoi.rejected, (state, { payload }) => {
      state.error = payload;
    });
    builder.addCase(deleteAoi.fulfilled, (state, { payload }) => {
      const filteredAois = state.aois.filter(aoi => aoi.id !== payload.id);

      state.aois = filteredAois;
      state.error = null;
    });
    builder.addCase(deleteAoi.rejected, (state, { payload }) => {
      state.error = payload;
    });
    builder.addCase(selectAoi.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(selectAoi.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(selectAoi.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {
  startDrawingAoi,
  endDrawingAoi,
  setAoiFeatures,
  onUnmount,
  setVisiblePanel,
  setSelectedAoi,
  updateAoi,
} = aoiSlice.actions;

const baseSelector = state => state?.aois;

export const aoiSelector = createSelector(baseSelector, state => state?.aoi);

export const aoiListSelector = createSelector(
  baseSelector,
  state => state?.aois,
);

export const isDrawingAoiSelector = createSelector(
  baseSelector,
  state => state?.isDrawingAoi,
);

export const visiblePanelSelector = createSelector(
  baseSelector,
  state => state?.visiblePanel,
);

export const selectedAoiSelector = createSelector(
  baseSelector,
  state => state?.selectedAoi,
);

export default aoiSlice.reducer;
