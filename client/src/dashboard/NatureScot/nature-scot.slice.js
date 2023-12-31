import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';
import { getAuthTokenForSource } from 'utils/tokens';

import {
  AVAILABLE_ACTIVITIES_URL,
  SEARCH_ACTIVITIES_URL,
} from './nature-scotland.constants';

const name = 'natureScotDashboard';

export const initialState = {
  isLoading: false,
  error: null,
  availableActivities: null,
  activities: null,
  impactAssessment: null,
  proposals: null,
  selectedProposal: null,
};

export const fetchImpactActivities = createAsyncThunk(
  `${name}/fetchImpactActivities`,
  async (props, { getState, rejectWithValue }) => {
    const {
      data: { tokens },
    } = getState();
    const authToken = getAuthTokenForSource(tokens, {
      source_id: AVAILABLE_ACTIVITIES_URL,
    });

    try {
      const data = await apiClient.natureScot.getImpactData(
        `/${AVAILABLE_ACTIVITIES_URL}/`,
        {},
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

export const searchImpactActivities = createAsyncThunk(
  `${name}/searchImpactActivities`,
  async (form, { getState, rejectWithValue }) => {
    const {
      data: { tokens },
    } = getState();
    const authToken = getAuthTokenForSource(tokens, {
      source_id: SEARCH_ACTIVITIES_URL,
    });

    try {
      const data = await apiClient.natureScot.getImpactData(
        `/${SEARCH_ACTIVITIES_URL}/`,
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

    // Filter description property, so that
    // it is not dispatched to IR api.
    const filteredForm = {
      startDate: form.startDate,
      endDate: form.endDate,
      activities: form.activities,
      geometry: form.geometry,
    };

    const {
      data: { tokens },
    } = getState();
    const authToken = getAuthTokenForSource(tokens, {
      source_id: apiSourceId,
    });

    try {
      const data = await apiClient.natureScot.getImpactData(
        `/${apiSourceId}/`,
        filteredForm,
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

export const fetchProposals = createAsyncThunk(
  `${name}/fetchProposals`,
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.proposals.getProposals();
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Fetching Proposal Error - ${message}`,
        50000,
        () => {},
      );
      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
);

export const saveProposal = createAsyncThunk(
  `${name}/saveProposal`,
  async (proposal, { rejectWithValue }) => {
    try {
      const newProposal = await apiClient.proposals.saveProposal(proposal);
      NotificationManager.success(
        '',
        `Successfully saved ${proposal.name}`,
        5000,
        () => {},
      );
      return newProposal;
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Adding Proposal Error`,
        50000,
        () => {},
      );
      return rejectWithValue({
        message: `${status} ${message}`,
      });
    }
  },
);

export const updateProposal = createAsyncThunk(
  `${name}/updateProposal`,
  async (proposal, { rejectWithValue }) => {
    try {
      const updatedProposal = await apiClient.proposals.updateProposal(
        proposal,
      );

      NotificationManager.success(
        `Successfully updated Proposal '${proposal.name}'`,
      );
      return updatedProposal;
    } catch (error) {
      const { message, status } = error;
      NotificationManager.error(
        `Error updating Proposal: ${message} Please try again`,
      );

      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
);

export const deleteProposal = createAsyncThunk(
  `${name}/deleteProposal`,
  async (proposal, { rejectWithValue }) => {
    try {
      await apiClient.proposals.deleteProposal(proposal.id);
      NotificationManager.success(
        '',
        `Successfully deleted ${proposal.name}`,
        5000,
        () => {},
      );
      return proposal;
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Deleting Proposal Error`,
        50000,
        () => {},
      );

      return rejectWithValue({
        message: `${status} ${message}`,
      });
    }
  },
);

export const selectProposal = createAsyncThunk(
  `${name}/selectProposal`,
  async ({ proposal }, { dispatch }) => {
    dispatch(setSelectedProposal(proposal));
    // return proposal;
  },
);

const natureScotSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSelectedProposal: (state, { payload }) => {
      state.selectedProposal = payload;
    },
    clearImpactAssessment: state => {
      state.impactAssessment = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchImpactActivities.fulfilled, (state, { payload }) => {
        state.availableActivities = payload;
        state.error = null;
      })
      .addCase(fetchImpactActivities.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(searchImpactActivities.fulfilled, (state, { payload }) => {
        state.activities = payload;
        state.error = null;
      })
      .addCase(searchImpactActivities.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(fetchImpactAssessment.fulfilled, (state, { payload }) => {
        state.impactAssessment = payload;
        state.error = null;
      })
      .addCase(fetchImpactAssessment.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(fetchProposals.fulfilled, (state, { payload }) => {
        state.proposals = payload;
        state.error = null;
      })
      .addCase(fetchProposals.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(saveProposal.fulfilled, (state, { payload }) => {
        state.proposals = state.proposals
          ? [payload, ...state.proposals]
          : [payload];
        state.error = null;
      })
      .addCase(saveProposal.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(updateProposal.fulfilled, (state, { payload }) => {
        state.proposals = state.proposals.map(proposal =>
          proposal.id !== payload.id ? proposal : payload,
        );
        state.error = null;
      })
      .addCase(updateProposal.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(deleteProposal.fulfilled, (state, { payload }) => {
        const filteredProposals = state.proposals.filter(
          proposal => proposal.id !== payload.id,
        );

        state.proposals = filteredProposals;
        state.error = null;
      })
      .addCase(deleteProposal.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(selectProposal.pending, state => {
        state.isLoading = true;
      })
      .addCase(selectProposal.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // state.selectedProposal = payload;
      })
      .addCase(selectProposal.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const { setSelectedProposal, clearImpactAssessment } =
  natureScotSlice.actions;

const baseSelector = state => state?.natureScotDashboard;

export const impactAvailableActivitiesSelector = createSelector(
  baseSelector,
  state => state?.availableActivities ?? [],
);

export const impactActivitiesSelector = createSelector(
  baseSelector,
  state => state?.activities ?? null,
);

export const impactAssessmentSelector = createSelector(
  baseSelector,
  state => state?.impactAssessment ?? null,
);

export const proposalsSelector = createSelector(
  baseSelector,
  state => state?.proposals,
);

export const selectedProposalSelector = createSelector(
  baseSelector,
  state => state?.selectedProposal,
);

export default natureScotSlice.reducer;
