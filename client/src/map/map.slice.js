import { createSlice } from '@reduxjs/toolkit';

import { getData, JSON_HEADERS } from '../utils/http';

import { regions } from './map.constants';

const initialState = {
  viewport: { zoom: 6, center: [-4.84, 54.71] },
  mapStyles: [],
  selectedMapStyle: {},
  isCompareMode: false,
  domains: [],
  regions,
  pollingPeriod: 30000,
  dataToken: null,
  dataSources: null,
  saveMap: false,
  dimensions: {
    width: -1,
    height: -1
  }
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setViewport: (state, { payload }) => {
      if (payload) {
        state.viewport = payload;
      }
    },
    selectMapStyle: (state, { payload }) => {
      state.selectedMapStyle = payload;
    },
    toggleCompareMode: state => {
      state.isCompareMode = !state.isCompareMode;
    },
    fetchSourcesSuccess: (state, { payload }) => {
      // Convert from minutes to millliseconds and then half the value.
      // This will ensure we update the token before it expires.
      const { domains, sources, token, timeout } = payload;
      const timeoutInMilliseconds = (timeout * 60 * 1000) / 2;
      state.dataToken = token;
      state.dataSources = sources;
      state.pollingPeriod = timeoutInMilliseconds;
      state.domains = domains;
    },
    fetchSourcesFailure: (state, { payload }) => {
      state.error = payload;
    },
    saveMap: state => {
      state.saveMap = !state.saveMap;
    }
  }
});

export const {
  setViewport,
  selectMapStyle,
  toggleCompareMode,
  fetchSourcesSuccess,
  fetchSourcesFailure,
  saveMap
} = mapSlice.actions;

export const fetchSources = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: 'Token ' + userKey
  };

  const response = await getData('/api/data/sources/', headers);
  const data = await response.json();

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;
    // NotificationManager.error(message, 'Fetching Source Data', 50000, () => {});
    return dispatch(fetchSourcesFailure({ message }));
  }

  const domains = Array.from(new Set(data.sources.map(source => source.metadata.domain)));

  return dispatch(fetchSourcesSuccess({ ...data, domains }));
};

export default mapSlice.reducer;
