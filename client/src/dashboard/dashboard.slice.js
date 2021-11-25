import { createSlice, createSelector } from '@reduxjs/toolkit';

import { userSelector } from 'accounts/accounts.selectors';
import { updateUser } from 'accounts/accounts.slice';

const name = 'dashboard';

export const initialState = {
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name,
  initialState,
  reducers: {
    setChartData: (state, { payload }) => {
      const { source_id, datasetName, data } = payload;

      state[source_id] = {
        ...state[source_id],
        [datasetName]: data,
      };
    },
  },
});

export const fetchChartData = (
  source_id,
  datasetName,
  url,
) => async dispatch => {
  const result = await import(`${url}.js`);
  dispatch(setChartData({ source_id, datasetName, data: result.default }));
};

export const updateTargets = (
  source_id,
  addedTargets,
  user,
) => async dispatch => {
  // adds targets to existing 'profiles' property on user
  const profiles = {
    orbis_profile: {
      ...user.profiles.orbis_profile,
      orb_state: {
        ...user.profiles.orbis_profile.orb_state,
        [source_id]: {
          ...(user.profiles.orbis_profile.orb_state?.[source_id] || {}),
          ...addedTargets,
        },
      },
    },
  };

  // combines new 'profiles' property with rest of user
  dispatch(updateUser(profiles));
};

export const { setChartData } = dashboardSlice.actions;

/** @param {import('typings').RootState} state */
const baseSelector = state => state?.dashboard;

/** @param {import('typings').Source['source_id']} source_id */
/** @param {string} datasetName */
export const chartDataSelector = (source_id, datasetName) =>
  createSelector(baseSelector, state => state?.[source_id]?.[datasetName]);

/** @param {import('typings').Source['source_id']} source_id */
export const userOrbStateSelector = source_id =>
  createSelector(
    userSelector,
    user => user?.profiles?.orbis_profile?.orb_state?.[source_id] ?? {},
  );

export default dashboardSlice.reducer;
