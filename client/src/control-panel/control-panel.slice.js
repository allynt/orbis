import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  isMenuVisible: false,
  visibleMenuItem: '',
  heading: '',
  strapline: '',
};

const controlPanelSlice = createSlice({
  name: 'controlPanel',
  initialState,
  reducers: {
    toggleMenu: (state, { payload }) => {
      if (!state.isMenuVisible && payload !== 'screenshot') {
        state.visibleMenuItem = payload;
        state.isMenuVisible = true;
      } else if (
        (state.isMenuVisible && state.visibleMenuItem === payload) ||
        payload === 'screenshot'
      ) {
        state.visibleMenuItem = '';
        state.isMenuVisible = false;
      } else {
        state.visibleMenuItem = payload;
      }
    },
    setMenuHeadings: (state, { payload }) => {
      state.heading = payload.heading;
      state.strapline = payload.strapline;
    },
    closeMenu: state => {
      state.visibleMenuItem = '';
      state.isMenuVisible = false;
    },
  },
});

export const {
  toggleMenu,
  setMenuHeadings,
  closeMenu,
} = controlPanelSlice.actions;

const baseSelector = state => state.controlPanel || {};
export const selectIsMenuVisible = createSelector(
  baseSelector,
  ({ isMenuVisible }) => isMenuVisible || false,
);
export const selectVisibleMenuItem = createSelector(
  baseSelector,
  ({ visibleMenuItem }) => visibleMenuItem || '',
);
export const selectHeading = createSelector(
  baseSelector,
  ({ heading }) => heading || '',
);
export const selectStrapline = createSelector(
  baseSelector,
  ({ strapline }) => strapline || '',
);

export default controlPanelSlice.reducer;
