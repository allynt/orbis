import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import apiClient from 'api-client';
import { getAuthTokenForSource } from 'utils/tokens';

const name = 'natureScotDashboard';

export const initialState = {
  isLoading: false,
  error: null,
  activities: null,
  impactAssessment: null,
};

export const fetchImpactActivities = createAsyncThunk(
  `${name}/fetchImpactActivities`,
  async (form, { getState, rejectWithValue }) => {
    const apiSourceId = 'ns/proxy/activities/latest';

    const {
      data: { tokens },
    } = getState();
    const authToken = getAuthTokenForSource(tokens, {
      source_id: apiSourceId,
    });

    try {
      const data = await apiClient.natureScot.getImpactData(
        `/${apiSourceId}/`,
        form,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return data;
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
  {
    condition: (_, { getState }) => {
      const {
        data: { requests },
      } = getState();
      return requests?.fetchImpactAssessment !== 'pending';
    },
  },
);

export const fetchImpactAssessment = createAsyncThunk(
  `${name}/fetchImpactAssessment`,
  async (form, { getState, rejectWithValue }) => {
    const apiSourceId = 'ns/proxy/impact/latest';

    const {
      data: { tokens },
    } = getState();
    const authToken = getAuthTokenForSource(tokens, {
      source_id: apiSourceId,
    });

    try {
      const data = await apiClient.natureScot.getImpactData(
        `/${apiSourceId}/`,
        form,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return data;
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
  {
    condition: (_, { getState }) => {
      const {
        data: { requests },
      } = getState();
      return requests?.fetchImpactAssessment !== 'pending';
    },
  },
);

const natureScotSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchImpactActivities.fulfilled, (state, { payload }) => {
        state.activities = payload;
        state.error = null;
      })
      .addCase(fetchImpactActivities.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(fetchImpactAssessment.fulfilled, (state, { payload }) => {
        state.impactAssessment = payload;
        state.error = null;
      })
      .addCase(fetchImpactAssessment.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

const baseSelector = state => state?.natureScotDashboard;

export const impactActivitiesSelector = createSelector(
  baseSelector,
  state => state?.activities ?? [],
);

export const impactAssessmentSelector = createSelector(
  baseSelector,
  state => state?.impactAssessment ?? null,
);

export default natureScotSlice.reducer;
