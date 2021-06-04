import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  isMissionControlDialogVisible: false,
};

const missionControlSlice = createSlice({
  name: 'missionControl',
  initialState,
  reducers: {
    toggleMissionControlDialog: (state, { payload }) => {
      state.isMissionControlDialogVisible = payload;
    },
  },
});

export const { toggleMissionControlDialog } = missionControlSlice.actions;

const baseSelector = state => state.missionControl || {};

export const selectIsMissionControlDialogVisible = createSelector(
  baseSelector,
  ({ isMissionControlDialogVisible }) => isMissionControlDialogVisible,
);

export default missionControlSlice.reducer;
