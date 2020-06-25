import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMenuVisible: false,
  visibleMenuItem: '',
  heading: '',
  strapline: '',
};

const sideMenuSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleMenu: (state, { payload }) => {
      if (!state.isMenuVisible && payload !== 'screenshot') {
        state.visibleMenuItem = payload;
        state.isMenuVisible = true;
      } else if ((state.isMenuVisible && state.visibleMenuItem === payload) || payload === 'screenshot') {
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

export const { toggleMenu, setMenuHeadings, closeMenu } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
