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
  impactAssessment: null,
};

export const fetchImpactAssessment = createAsyncThunk(
  `${name}/fetchImpactAssessment`,
  async (form, { getState, rejectWithValue, dispatch }) => {
    const apiSourceId = 'ns/proxy/impact/latest';

    const {
      data: { tokens },
    } = getState();
    const authToken = getAuthTokenForSource(tokens, {
      source_id: apiSourceId,
    });

    try {
      const data = await apiClient.natureScot.getImpactAssessment(
        `/${apiSourceId}/`,
        form,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // dispatch(setImpactResults(data));
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

export const impactAssessmentSelector = createSelector(
  baseSelector,
  state => state?.impactAssessment ?? null,
);

export default natureScotSlice.reducer;
