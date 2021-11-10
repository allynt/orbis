import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import { userSelector } from 'accounts/accounts.selectors';
import apiClient from 'api-client';

import { Panels } from '../data-layers.constants';

const name = 'aois';

export const saveAoi = createAsyncThunk(
  `${name}/saveAoi`,
  async (params, { getState, dispatch, rejectWithValue }) => {
    const { id: userId, customers } = userSelector(getState());
    const { id: customerId } = customers[0];

    try {
      await apiClient.aois.saveAoi({ customerId, userId });
      NotificationManager.success(`Successfully saved AOI '${params.name}'`);
      return;
    } catch (responseError) {
      const message = await responseError.getErrors();
      NotificationManager.error(
        `Error saving AOI: ${message} Please try again`,
      );
      return rejectWithValue({ message });
    }
  },
  {
    condition: (_, { getState }) => {
      const requestId = getState().aois.requests?.saveAoi;
      return !requestId;
    },
  },
);

const initialState = {
  isDrawingAoi: false,
  visiblePanel: Panels.DATA_LAYERS,
  requests: {},
};

const satellitesSlice = createSlice({
  name,
  initialState,
  reducers: {
    startDrawingAoi: state => {
      state.isDrawingAoi = true;
      if (state.aoi?.length >= 1) state.aoi = undefined;
    },
    endDrawingAoi: (state, { payload }) => {
      state.isDrawingAoi = false;
      state.aoi = payload;
    },
    onUnmount: state => {
      state.isDrawingAoi = false;
    },
    setVisiblePanel: (state, { payload }) => {
      state.visiblePanel = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(saveAoi.pending, (state, { meta }) => {
      state.requests.saveAoi = meta.requestId;
    });
    builder.addCase(saveAoi.fulfilled, state => {
      state.requests.saveAoi = undefined;
    });
    builder.addCase(saveAoi.rejected, (state, { error }) => {
      state.requests.saveAoi = undefined;
      state.error = { message: error.message };
    });
  },
});

export const {
  startDrawingAoi,
  endDrawingAoi,
  onUnmount,
  setVisiblePanel,
} = satellitesSlice.actions;

const baseSelector = state => state?.aois;

export const aoiSelector = createSelector(baseSelector, state => state?.aoi);

export const isDrawingAoiSelector = createSelector(
  baseSelector,
  state => state?.isDrawingAoi,
);

export const visiblePanelSelector = createSelector(
  baseSelector,
  state => state?.visiblePanel,
);

export default satellitesSlice.reducer;
